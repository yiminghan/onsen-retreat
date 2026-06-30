import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { videoSubmissions } from "~/server/db/schema";
import { sendVideoSubmissionEmail } from "~/server/email/templates/videoSubmission";

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
});
