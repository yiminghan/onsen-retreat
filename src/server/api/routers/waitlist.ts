import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { waitlist } from "~/server/db/schema";
import { sendOnboardingEmail } from "~/server/email/templates/onboarding";

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

      const [inserted] = await ctx.db
        .insert(waitlist)
        .values({
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          handle: trim(input.handle),
          school: trim(input.school),
          project: input.project.trim(),
          notes: trim(input.notes),
        })
        .onConflictDoNothing()
        .returning();

      // Only email genuinely new signups (a conflict returns no row), and flip
      // the flag only after a successful send so we can retry failures later.
      if (inserted) {
        try {
          await sendOnboardingEmail({
            to: inserted.email,
            name: inserted.name,
          });

          await ctx.db
            .update(waitlist)
            .set({ onboardingEmailSent: true })
            .where(eq(waitlist.id, inserted.id));
        } catch (error) {
          console.error("Failed to send onboarding email", error);
        }
      }

      return { ok: true };
    }),
});
