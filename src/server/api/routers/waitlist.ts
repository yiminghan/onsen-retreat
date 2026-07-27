import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { waitlist } from "~/server/db/schema";
import { addContactToSegment } from "~/server/email";
import { sendOnboardingEmail } from "~/server/email/templates/onboarding";
import { sendSlackNotification } from "~/server/slack";

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        email: z.string().email(),
        handle: z.string().max(256).optional(),
        school: z.string().max(256).optional(),
        project: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const trim = (value?: string) => {
        const trimmed = value?.trim();
        return trimmed ?? null;
      };

      const email = input.email.toLowerCase().trim();

      let inserted;
      try {
        [inserted] = await ctx.db
          .insert(waitlist)
          .values({
            name: input.name.trim(),
            email,
            handle: trim(input.handle),
            school: trim(input.school),
            project: input.project.trim(),
            notes: trim(input.notes),
          })
          .onConflictDoNothing()
          .returning();
      } catch (error) {
        console.error(`[waitlist.join] db insert failed for ${email}`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join the waitlist. Please try again.",
          cause: error,
        });
      }

      // Only email genuinely new signups (a conflict returns no row), and flip
      // the flag only after a successful send so we can retry failures later.
      if (!inserted) {
        console.log(`[waitlist.join] duplicate signup ignored for ${email}`);
      }

      if (inserted) {
        await sendSlackNotification(
          `🌱 New signup: *${inserted.name}* (${inserted.email})` +
            (inserted.handle ? ` · ${inserted.handle}` : "") +
            (inserted.school ? ` · ${inserted.school}` : "") +
            `\nProject: ${inserted.project}`,
        );

        let onboardingEmailSent = false;
        try {
          await sendOnboardingEmail({
            to: inserted.email,
            name: inserted.name,
          });
          onboardingEmailSent = true;
        } catch (error) {
          console.error(
            `[waitlist.join] onboarding email failed for ${inserted.email}`,
            error,
          );
        }

        if (onboardingEmailSent) {
          try {
            await ctx.db
              .update(waitlist)
              .set({ onboardingEmailSent: true })
              .where(eq(waitlist.id, inserted.id));
          } catch (error) {
            console.error(
              `[waitlist.join] db update of onboardingEmailSent flag failed for ${inserted.email} (id ${inserted.id})`,
              error,
            );
          }
        }

        // Auto-add new signups to the Resend segment. Independent of the
        // onboarding email — a failure here shouldn't break signup.
        try {
          await addContactToSegment({
            email: inserted.email,
            name: inserted.name,
          });
        } catch (error) {
          console.error(
            `[waitlist.join] failed to add ${inserted.email} to Resend segment`,
            error,
          );
        }
      }

      return { ok: true };
    }),
});
