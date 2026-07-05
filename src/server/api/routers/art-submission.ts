import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { artSubmissions } from "~/server/db/schema";
import { sendArtSubmissionEmail } from "~/server/email/templates/artSubmission";
import { sendSlackNotification } from "~/server/slack";

const normalizeHandle = (value: string) =>
  value.trim().replace(/^@+/, "").toLowerCase();

export const artSubmissionRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        email: z.string().email(),
        handle: z.string().min(1).max(256),
        projectLink: z.string().url(),
        videoLink: z.string().url(),
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
        .insert(artSubmissions)
        .values({
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          handle,
          projectLink: input.projectLink.trim(),
          videoLink: trim(input.videoLink),
          notes: trim(input.notes),
        })
        .returning();

      // Flip the flag only after a successful send so we can retry failures.
      if (inserted) {
        await sendSlackNotification(
          `🎨 New art/design submission from *${inserted.name}* (${inserted.handle}) · ${inserted.email}` +
            `\nArtwork: ${inserted.projectLink}` +
            (inserted.videoLink ? `\nVideo: ${inserted.videoLink}` : ""),
        );

        try {
          await sendArtSubmissionEmail({
            to: inserted.email,
            name: inserted.name,
            handle: inserted.handle,
          });

          await ctx.db
            .update(artSubmissions)
            .set({ confirmationEmailSent: true })
            .where(eq(artSubmissions.id, inserted.id));
        } catch (error) {
          console.error("Failed to send art submission email", error);
        }
      }

      return { ok: true };
    }),
});
