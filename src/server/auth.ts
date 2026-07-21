import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { waitUntil } from "@vercel/functions";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  account,
  rateLimit,
  session,
  user,
  verification,
} from "~/server/db/schema";
import { sendResetPasswordEmail } from "~/server/email/templates/resetPassword";
import { sendVerifyEmail } from "~/server/email/templates/verifyEmail";

export const auth = betterAuth({
  appName: "Onsen Retreat",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    // Keys are Better Auth model names; the physical tables are prefixed
    // `onsen_` via the createTable helper in schema.ts.
    schema: { user, session, account, verification, rateLimit },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ to: user.email, name: user.name, url });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerifyEmail({ to: user.email, name: user.name, url });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  rateLimit: {
    enabled: true,
    // In-memory counters reset on every serverless invocation.
    storage: "database",
  },
  trustedOrigins: ["https://onsen-retreat.com", "https://www.onsen-retreat.com"],
  advanced: {
    // Emails are sent as background tasks; without waitUntil Vercel may
    // freeze the lambda before they go out.
    backgroundTasks: { handler: (p) => waitUntil(p) },
  },
  // nextCookies must stay last so Set-Cookie works from all Next.js contexts.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
