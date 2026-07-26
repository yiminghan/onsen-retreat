import { eq, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { videoSubmissions } from "~/server/db/schema";
import { sendVideoSubmissionEmail } from "~/server/email/templates/videoSubmission";
import { sendVideoThankYouEmail } from "~/server/email/templates/videoThankYou";
import { sendSlackNotification } from "~/server/slack";

const normalizeHandle = (value: string) =>
  value.trim().replace(/^@+/, "").toLowerCase();

export const videoSubmissionRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        handle: z.string().min(1).max(256),
        email: z.string().email(),
        submissionLink: z.string().url(),
        name: z.string().max(256).optional(),
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
        .insert(videoSubmissions)
        .values({
          handle,
          email: input.email.toLowerCase().trim(),
          submissionLink: input.submissionLink.trim(),
          name: trim(input.name),
          notes: trim(input.notes),
        })
        .onConflictDoNothing()
        .returning();

      // Only email genuinely new entries (a duplicate handle returns no row),
      // and flip the flag only after a successful send so we can retry failures.
      if (inserted) {
        await sendSlackNotification(
          `🎬 New video submission from *${inserted.handle}*` +
            (inserted.name ? ` (${inserted.name})` : "") +
            ` · ${inserted.email}` +
            `\nLink: ${inserted.submissionLink}`,
        );

        try {
          await sendVideoSubmissionEmail({
            to: inserted.email,
            name: inserted.name,
            handle: inserted.handle,
          });

          await ctx.db
            .update(videoSubmissions)
            .set({ confirmationEmailSent: true })
            .where(eq(videoSubmissions.id, inserted.id));
        } catch (error) {
          console.error("Failed to send video submission email", error);
        }
      }

      return { ok: true };
    }),

  /** Counts shown on the thank-you email admin page. */
  thankYouStatus: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: videoSubmissions.id,
        thankYouEmailSent: videoSubmissions.thankYouEmailSent,
      })
      .from(videoSubmissions);

    const pending = rows.filter((r) => !r.thankYouEmailSent).length;
    return { total: rows.length, pending };
  }),

  /**
   * Send the thank-you email to every entry that hasn't received it yet.
   * Deduped by email address; the flag is only flipped after a successful
   * send, so re-running retries failures without double-sending successes.
   */
  sendThankYouEmails: protectedProcedure.mutation(async ({ ctx }) => {
    const pending = await ctx.db
      .select()
      .from(videoSubmissions)
      .where(
        or(
          isNull(videoSubmissions.thankYouEmailSent),
          eq(videoSubmissions.thankYouEmailSent, false),
        ),
      );

    // One email per address even if someone entered multiple videos.
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
        await sendVideoThankYouEmail({ to: email, name: rows[0]?.name });

        await ctx.db
          .update(videoSubmissions)
          .set({ thankYouEmailSent: true })
          .where(
            inArray(
              videoSubmissions.id,
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
