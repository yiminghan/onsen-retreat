import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { waitlist } from "~/server/db/schema";

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
        return trimmed ? trimmed : null;
      };

      await ctx.db
        .insert(waitlist)
        .values({
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          handle: trim(input.handle),
          school: trim(input.school),
          project: input.project.trim(),
          notes: trim(input.notes),
        })
        .onConflictDoNothing();

      return { ok: true };
    }),
});
