import { and, count, countDistinct, desc, eq, ne, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { db } from "~/server/db";
import {
  membership,
  retreatApplications,
  retreatParticipants,
  retreatRules,
  retreats,
  user,
} from "~/server/db/schema";
import {
  APPLICATION_STATUSES,
  APPLICATION_TAGS,
  PARTICIPANT_ROLES,
  RETREAT_STATUSES,
  isAcceptingApplications,
} from "~/lib/retreat";
import { sendSlackNotification } from "~/server/slack";

type Db = typeof db;

/** Public retreat columns — shared by `list` and `getBySlug`. */
const retreatColumns = {
  id: retreats.id,
  slug: retreats.slug,
  name: retreats.name,
  description: retreats.description,
  location: retreats.location,
  startDate: retreats.startDate,
  endDate: retreats.endDate,
  capacity: retreats.capacity,
  coverImage: retreats.coverImage,
  status: retreats.status,
  applicationsCloseAt: retreats.applicationsCloseAt,
};

/** Drafts are internal and deleted retreats only keep their rows — every public read filters both out. */
const publicRetreats = and(
  ne(retreats.status, "draft"),
  eq(retreats.deleted, false),
);

const decisionStatus = z.enum(APPLICATION_STATUSES).exclude(["withdrawn"]);

/** Editable retreat fields — shared by admin `save` for create and update. */
const retreatFields = z.object({
  slug: z
    .string()
    .min(1)
    .max(128)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens.",
    ),
  name: z.string().trim().min(1).max(256),
  description: z.string().max(20000).nullish(),
  location: z.string().max(256).nullish(),
  startDate: z.date().nullish(),
  endDate: z.date().nullish(),
  capacity: z.number().int().min(1).max(10000).nullish(),
  coverImage: z.string().max(2048).nullish(),
  status: z.enum(RETREAT_STATUSES),
  applicationsCloseAt: z.date().nullish(),
});

/**
 * Participants are tied to `membership`, so accepting an applicant who never
 * filled in their profile needs a membership row first.
 */
async function ensureMembershipId(db: Db, userId: string) {
  const [inserted] = await db
    .insert(membership)
    .values({ userId })
    .onConflictDoNothing({ target: membership.userId })
    .returning({ id: membership.id });

  if (inserted) return inserted.id;

  const existing = await db.query.membership.findFirst({
    where: eq(membership.userId, userId),
    columns: { id: true },
  });

  if (!existing) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not resolve a membership for this user.",
    });
  }

  return existing.id;
}

export const retreatRouter = createTRPCRouter({
  /** Every non-draft retreat, newest scheduled first, with participant counts. */
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        ...retreatColumns,
        participantCount: count(retreatParticipants.id),
      })
      .from(retreats)
      .leftJoin(
        retreatParticipants,
        eq(retreatParticipants.retreatId, retreats.id),
      )
      .where(publicRetreats)
      .groupBy(retreats.id)
      .orderBy(sql`${retreats.startDate} desc nulls last`, desc(retreats.id));
  }),

  /** A single retreat plus its participant roster. */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(128) }))
    .query(async ({ ctx, input }) => {
      const [retreat] = await ctx.db
        .select(retreatColumns)
        .from(retreats)
        .where(and(eq(retreats.slug, input.slug), publicRetreats))
        .limit(1);

      if (!retreat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const participants = await ctx.db
        .select({
          id: retreatParticipants.id,
          role: retreatParticipants.role,
          name: user.name,
          image: user.image,
          bio: membership.bio,
          instagram: membership.instagram,
          twitter: membership.twitter,
          linkedin: membership.linkedin,
        })
        .from(retreatParticipants)
        .innerJoin(
          membership,
          eq(membership.id, retreatParticipants.membershipId),
        )
        .innerJoin(user, eq(user.id, membership.userId))
        .where(eq(retreatParticipants.retreatId, retreat.id))
        .orderBy(retreatParticipants.id);

      // Applicants who consented to marketing get their entry shown publicly.
      // Only the entry itself — never email, motivation, notes or status.
      const applications = await ctx.db
        .select({
          id: retreatApplications.id,
          tag: retreatApplications.tag,
          project: retreatApplications.project,
          projectLink: retreatApplications.projectLink,
          videoLink: retreatApplications.videoLink,
          handle: retreatApplications.applicantHandle,
          name: sql<string>`coalesce(${user.name}, ${retreatApplications.applicantName}, 'Anonymous')`,
          // Backfilled entries keep their provenance so the page can find the
          // static thumbnail snapshot captured for /retreat-1.
          sourceTable: retreatApplications.sourceTable,
          sourceId: retreatApplications.sourceId,
        })
        .from(retreatApplications)
        .leftJoin(user, eq(user.id, retreatApplications.userId))
        .where(
          and(
            eq(retreatApplications.retreatId, retreat.id),
            ne(retreatApplications.status, "withdrawn"),
            // Video entries predate the consent checkbox; they were public
            // reels, so they count as consented.
            or(
              eq(retreatApplications.marketingConsent, true),
              eq(retreatApplications.tag, "video"),
            ),
          ),
        )
        .orderBy(desc(retreatApplications.createdAt));

      const [ruleCount] = await ctx.db
        .select({ count: count() })
        .from(retreatRules)
        .where(eq(retreatRules.retreatId, retreat.id));

      return {
        retreat,
        participants,
        applications,
        hasRules: (ruleCount?.count ?? 0) > 0,
      };
    }),

  /** Rule sections for one retreat, in display order — powers /retreats/[slug]/rules. */
  rules: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(128) }))
    .query(async ({ ctx, input }) => {
      const [retreat] = await ctx.db
        .select({ id: retreats.id, slug: retreats.slug, name: retreats.name })
        .from(retreats)
        .where(and(eq(retreats.slug, input.slug), publicRetreats))
        .limit(1);

      if (!retreat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const rules = await ctx.db
        .select({
          id: retreatRules.id,
          sectionId: retreatRules.sectionId,
          label: retreatRules.label,
          groupLabel: retreatRules.groupLabel,
          content: retreatRules.content,
        })
        .from(retreatRules)
        .where(eq(retreatRules.retreatId, retreat.id))
        .orderBy(retreatRules.sortOrder, retreatRules.id);

      return { retreat, rules };
    }),

  /** The signed-in user's application for one retreat, or null. */
  myApplication: protectedProcedure
    .input(z.object({ retreatId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const [application] = await ctx.db
        .select({
          id: retreatApplications.id,
          retreatId: retreatApplications.retreatId,
          tag: retreatApplications.tag,
          status: retreatApplications.status,
          motivation: retreatApplications.motivation,
          project: retreatApplications.project,
          projectLink: retreatApplications.projectLink,
          videoLink: retreatApplications.videoLink,
          notes: retreatApplications.notes,
          decidedAt: retreatApplications.decidedAt,
          createdAt: retreatApplications.createdAt,
        })
        .from(retreatApplications)
        .where(
          and(
            eq(retreatApplications.retreatId, input.retreatId),
            eq(retreatApplications.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      return application ?? null;
    }),

  /** Every application the signed-in user has made, newest first. */
  myApplications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: retreatApplications.id,
        tag: retreatApplications.tag,
        status: retreatApplications.status,
        createdAt: retreatApplications.createdAt,
        retreatName: retreats.name,
        retreatSlug: retreats.slug,
      })
      .from(retreatApplications)
      .innerJoin(
        retreats,
        and(
          eq(retreats.id, retreatApplications.retreatId),
          eq(retreats.deleted, false),
        ),
      )
      .where(eq(retreatApplications.userId, ctx.session.user.id))
      .orderBy(desc(retreatApplications.createdAt));
  }),

  /**
   * Apply to a retreat. Re-applying after withdrawing reuses the same row and
   * resets it to `submitted`; any other existing application is a conflict.
   */
  // Named `submit` rather than `apply` — tRPC reserves Function.prototype keys.
  submit: protectedProcedure
    .input(
      z.object({
        retreatId: z.number().int(),
        tag: z.enum(APPLICATION_TAGS).default("retreat"),
        motivation: z.string().min(1).max(2000),
        project: z.string().max(2000).optional(),
        // Empty strings come from untouched optional URL fields.
        projectLink: z.union([z.string().url(), z.literal("")]).optional(),
        videoLink: z.union([z.string().url(), z.literal("")]).optional(),
        notes: z.string().max(2000).optional(),
        marketingConsent: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [retreat] = await ctx.db
        .select({
          id: retreats.id,
          name: retreats.name,
          status: retreats.status,
          applicationsCloseAt: retreats.applicationsCloseAt,
        })
        .from(retreats)
        .where(and(eq(retreats.id, input.retreatId), publicRetreats))
        .limit(1);

      if (!retreat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!isAcceptingApplications(retreat)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This retreat is not accepting applications right now.",
        });
      }

      const trim = (value?: string) => value?.trim() ?? null;

      const values = {
        tag: input.tag,
        motivation: input.motivation.trim(),
        project: trim(input.project),
        projectLink: trim(input.projectLink),
        videoLink: trim(input.videoLink),
        notes: trim(input.notes),
        marketingConsent: input.marketingConsent ?? false,
        // Denormalized so an application still names its applicant if the
        // account is later deleted, and so it reads like a backfilled row.
        applicantName: ctx.session.user.name,
        applicantEmail: ctx.session.user.email,
        status: "submitted" as const,
        decidedAt: null,
      };

      const [existing] = await ctx.db
        .select({
          id: retreatApplications.id,
          status: retreatApplications.status,
        })
        .from(retreatApplications)
        .where(
          and(
            eq(retreatApplications.retreatId, retreat.id),
            eq(retreatApplications.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (existing && existing.status !== "withdrawn") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already applied to this retreat.",
        });
      }

      const [application] = existing
        ? await ctx.db
            .update(retreatApplications)
            .set(values)
            .where(eq(retreatApplications.id, existing.id))
            .returning()
        : await ctx.db
            .insert(retreatApplications)
            .values({
              retreatId: retreat.id,
              userId: ctx.session.user.id,
              ...values,
            })
            .returning();

      await sendSlackNotification(
        `📝 New ${values.tag} application for *${retreat.name}* from ${ctx.session.user.name} (${ctx.session.user.email})` +
          `\n${values.motivation.slice(0, 500)}` +
          (values.project ? `\nProject: ${values.project.slice(0, 300)}` : "") +
          (values.projectLink ? `\nLink: ${values.projectLink}` : "") +
          (values.videoLink ? `\nVideo: ${values.videoLink}` : ""),
      );

      return application;
    }),

  /** Withdraw an application. Also drops the participant row if accepted. */
  withdraw: protectedProcedure
    .input(z.object({ retreatId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const [application] = await ctx.db
        .update(retreatApplications)
        .set({ status: "withdrawn", decidedAt: null })
        .where(
          and(
            eq(retreatApplications.retreatId, input.retreatId),
            eq(retreatApplications.userId, ctx.session.user.id),
          ),
        )
        .returning({ id: retreatApplications.id });

      if (!application) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await removeParticipant(ctx.db, input.retreatId, ctx.session.user.id);

      return { ok: true };
    }),

  /** Admin view — every retreat including drafts, with roster and application counts. */
  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        ...retreatColumns,
        createdAt: retreats.createdAt,
        updatedAt: retreats.updatedAt,
        participantCount: countDistinct(retreatParticipants.id),
        applicationCount: countDistinct(retreatApplications.id),
      })
      .from(retreats)
      .leftJoin(
        retreatParticipants,
        eq(retreatParticipants.retreatId, retreats.id),
      )
      .leftJoin(
        retreatApplications,
        eq(retreatApplications.retreatId, retreats.id),
      )
      .where(eq(retreats.deleted, false))
      .groupBy(retreats.id)
      .orderBy(sql`${retreats.startDate} desc nulls last`, desc(retreats.id));
  }),

  /** Create a retreat (no `id`) or update an existing one (`id` set). */
  save: adminProcedure
    .input(
      retreatFields
        .extend({ id: z.number().int().optional() })
        .refine((r) => !r.startDate || !r.endDate || r.endDate >= r.startDate, {
          message: "The end date can't be before the start date.",
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;
      // Empty and whitespace-only strings store as null.
      const trim = (value?: string | null) => {
        const trimmed = value?.trim() ?? "";
        return trimmed === "" ? null : trimmed;
      };

      const values = {
        slug: fields.slug,
        name: fields.name,
        status: fields.status,
        description: trim(fields.description),
        location: trim(fields.location),
        coverImage: trim(fields.coverImage),
        startDate: fields.startDate ?? null,
        endDate: fields.endDate ?? null,
        capacity: fields.capacity ?? null,
        applicationsCloseAt: fields.applicationsCloseAt ?? null,
      };

      const [taken] = await ctx.db
        .select({ id: retreats.id })
        .from(retreats)
        .where(eq(retreats.slug, values.slug))
        .limit(1);

      if (taken && taken.id !== id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Another retreat already uses that slug.",
        });
      }

      if (id === undefined) {
        const [created] = await ctx.db
          .insert(retreats)
          .values(values)
          .returning({ id: retreats.id });
        return { id: created!.id };
      }

      const [updated] = await ctx.db
        .update(retreats)
        .set(values)
        .where(eq(retreats.id, id))
        .returning({ id: retreats.id });

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return { id: updated.id };
    }),

  /**
   * Soft-delete a retreat — flags the row as deleted so it disappears from
   * every view while its applications and participants stay intact.
   */
  remove: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(retreats)
        .set({ deleted: true })
        .where(and(eq(retreats.id, input.id), eq(retreats.deleted, false)))
        .returning({ id: retreats.id });

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return { ok: true };
    }),

  /** Reviewer view — every application for a retreat with the applicant. */
  listApplications: adminProcedure
    .input(z.object({ retreatId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: retreatApplications.id,
          tag: retreatApplications.tag,
          status: retreatApplications.status,
          motivation: retreatApplications.motivation,
          project: retreatApplications.project,
          projectLink: retreatApplications.projectLink,
          videoLink: retreatApplications.videoLink,
          notes: retreatApplications.notes,
          reviewNotes: retreatApplications.reviewNotes,
          confirmationEmailSent: retreatApplications.confirmationEmailSent,
          thankYouEmailSent: retreatApplications.thankYouEmailSent,
          rejectionEmailText: retreatApplications.rejectionEmailText,
          rejectionEmailSent: retreatApplications.rejectionEmailSent,
          handle: retreatApplications.applicantHandle,
          hasAccount: sql<boolean>`${retreatApplications.userId} is not null`,
          decidedAt: retreatApplications.decidedAt,
          createdAt: retreatApplications.createdAt,
          // Backfilled entries have no account, so fall back to the identity
          // captured on the original form. Left join for the same reason.
          applicantName: sql<string>`coalesce(${user.name}, ${retreatApplications.applicantName}, 'Unknown')`,
          applicantEmail: sql<string>`coalesce(${user.email}, ${retreatApplications.applicantEmail}, '')`,
        })
        .from(retreatApplications)
        .leftJoin(user, eq(user.id, retreatApplications.userId))
        .where(eq(retreatApplications.retreatId, input.retreatId))
        .orderBy(desc(retreatApplications.createdAt));
    }),

  /**
   * Move an application to a new status. Accepting adds the applicant to the
   * retreat roster; any other decision removes them again. Backfilled entries
   * with no account can still be decided, but can't join the roster — the
   * roster hangs off `membership`, which needs a user.
   */
  decide: adminProcedure
    .input(
      z.object({
        applicationId: z.number().int(),
        status: decisionStatus,
        reviewNotes: z.string().max(2000).optional(),
        role: z.enum(PARTICIPANT_ROLES).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [application] = await ctx.db
        .update(retreatApplications)
        .set({
          status: input.status,
          reviewNotes: input.reviewNotes?.trim() ?? null,
          decidedAt: new Date(),
        })
        .where(eq(retreatApplications.id, input.applicationId))
        .returning({
          id: retreatApplications.id,
          retreatId: retreatApplications.retreatId,
          userId: retreatApplications.userId,
        });

      if (!application) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!application.userId) {
        return { ok: true, addedToRoster: false };
      }

      if (input.status === "accepted") {
        const membershipId = await ensureMembershipId(
          ctx.db,
          application.userId,
        );

        await ctx.db
          .insert(retreatParticipants)
          .values({
            retreatId: application.retreatId,
            membershipId,
            role: input.role ?? "participant",
          })
          .onConflictDoNothing();
      } else {
        await removeParticipant(
          ctx.db,
          application.retreatId,
          application.userId,
        );
      }

      return { ok: true, addedToRoster: input.status === "accepted" };
    }),
});

/**
 * Drop a user from a retreat roster. No-op when they were never on it, so it's
 * safe to call on any non-accept decision.
 */
async function removeParticipant(db: Db, retreatId: number, userId: string) {
  const [row] = await db
    .select({ id: membership.id })
    .from(membership)
    .where(eq(membership.userId, userId))
    .limit(1);

  if (!row) return;

  await db
    .delete(retreatParticipants)
    .where(
      and(
        eq(retreatParticipants.retreatId, retreatId),
        eq(retreatParticipants.membershipId, row.id),
      ),
    );
}
