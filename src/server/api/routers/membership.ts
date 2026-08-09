import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { membership } from "~/server/db/schema";

/**
 * Accepts "@handle", a full profile URL, or a bare handle and stores just the
 * normalized handle (lowercased). Empty input clears the field.
 */
const normalizeHandle = (value: string | undefined | null) => {
  if (!value) return null;
  const trimmed = value
    .trim()
    .replace(/^https?:\/\/(www\.)?[^/]+\/(in\/)?/i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
  return trimmed ? trimmed.toLowerCase() : null;
};

const handleSchema = z.string().max(256).optional();

export const membershipRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const row = await ctx.db.query.membership.findFirst({
      where: eq(membership.userId, ctx.session.user.id),
    });
    return row ?? null;
  }),

  update: protectedProcedure
    .input(
      z.object({
        bio: z.string().max(1000).optional(),
        instagram: handleSchema,
        twitter: handleSchema,
        linkedin: handleSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const values = {
        bio: input.bio?.trim() ? input.bio.trim() : null,
        instagram: normalizeHandle(input.instagram),
        twitter: normalizeHandle(input.twitter),
        linkedin: normalizeHandle(input.linkedin),
      };

      const [row] = await ctx.db
        .insert(membership)
        .values({ userId: ctx.session.user.id, ...values })
        .onConflictDoUpdate({
          target: membership.userId,
          set: values,
        })
        .returning();

      return row;
    }),
});
