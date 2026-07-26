import { eq, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { hackathonSubmissions } from "~/server/db/schema";
import { sendHackathonSubmissionEmail } from "~/server/email/templates/hackathonSubmission";
import { sendHackathonThankYouEmail } from "~/server/email/templates/hackathonThankYou";
import { sendSlackNotification } from "~/server/slack";

const normalizeHandle = (value: string) =>
  value.trim().replace(/^@+/, "").toLowerCase();

export const hackathonSubmissionRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        email: z.string().email(),
        handle: z.string().min(1).max(256),
        projectLink: z.string().url(),
        videoLink: z.string().url(),
        marketingConsent: z.boolean().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const trim = (value?: string) => {
        const trimmed = value?.trim();
        return trimmed ?? null;
      };

      const handle = normalizeHandle(input.handle);

      const [inserted] = await ctx.db
        .insert(hackathonSubmissions)
        .values({
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          handle,
          projectLink: input.projectLink.trim(),
          videoLink: trim(input.videoLink),
          marketingConsent: input.marketingConsent ?? false,
          notes: trim(input.notes),
        })
        .returning();

      // Flip the flag only after a successful send so we can retry failures.
      if (inserted) {
        await sendSlackNotification(
          `🛠️ New hackathon submission from *${inserted.name}* (${inserted.handle}) · ${inserted.email}` +
            `\nProject: ${inserted.projectLink}` +
            (inserted.videoLink ? `\nVideo: ${inserted.videoLink}` : "") +
            `\nMarketing consent: ${inserted.marketingConsent ? "yes" : "no"}`,
        );

        try {
          await sendHackathonSubmissionEmail({
            to: inserted.email,
            name: inserted.name,
            handle: inserted.handle,
          });

          await ctx.db
            .update(hackathonSubmissions)
            .set({ confirmationEmailSent: true })
            .where(eq(hackathonSubmissions.id, inserted.id));
        } catch (error) {
          console.error("Failed to send hackathon submission email", error);
        }
      }

      return { ok: true };
    }),

  /** Counts shown on the thank-you email admin page. */
  thankYouStatus: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: hackathonSubmissions.id,
        thankYouEmailSent: hackathonSubmissions.thankYouEmailSent,
      })
      .from(hackathonSubmissions);

    const pending = rows.filter((r) => !r.thankYouEmailSent).length;
    return { total: rows.length, pending };
  }),

  /**
   * Send the thank-you email to every submission that hasn't received it yet.
   * Deduped by email address; the flag is only flipped after a successful
   * send, so re-running retries failures without double-sending successes.
   */
  sendThankYouEmails: protectedProcedure.mutation(async ({ ctx }) => {
    const pending = await ctx.db
      .select()
      .from(hackathonSubmissions)
      .where(
        or(
          isNull(hackathonSubmissions.thankYouEmailSent),
          eq(hackathonSubmissions.thankYouEmailSent, false),
        ),
      );

    // One email per address even if someone submitted multiple projects.
    const byEmail = new Map<string, typeof pending>();
    for (const row of pending) {
      const key = row.email.toLowerCase().trim();
      const group = byEmail.get(key);
      if (group) group.push(row);
      else byEmail.set(key, [row]);
    }

    let sent = 0;
    const failed: string[] = [];

    for (const [email, rows] of byEmail) {
      try {
        await sendHackathonThankYouEmail({ to: email, name: rows[0]?.name });

        await ctx.db
          .update(hackathonSubmissions)
          .set({ thankYouEmailSent: true })
          .where(
            inArray(
              hackathonSubmissions.id,
              rows.map((r) => r.id),
            ),
          );

        sent += 1;
      } catch (error) {
        console.error(`Failed to send thank-you email to ${email}`, error);
        failed.push(email);
      }

      // Stay under Resend's 2 requests/second rate limit.
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    return { sent, failed, pending: byEmail.size };
  }),
});
