// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `onsen_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const waitlist = createTable(
  "waitlist",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    email: d.varchar({ length: 320 }).notNull(),
    handle: d.varchar({ length: 256 }),
    school: d.varchar({ length: 256 }),
    project: d.text().notNull(),
    notes: d.text(),
    onboardingEmailSent: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("waitlist_email_idx").on(t.email)],
);

export const videoSubmissions = createTable(
  "video_submission",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    // Normalized IG handle (lowercased, no leading "@") — one entry per person.
    handle: d.varchar({ length: 256 }).notNull(),
    email: d.varchar({ length: 320 }).notNull(),
    submissionLink: d.text().notNull(),
    name: d.varchar({ length: 256 }),
    notes: d.text(),
    confirmationEmailSent: d.boolean().default(false),
    thankYouEmailSent: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("video_submission_handle_idx").on(t.handle)],
);

export const hackathonSubmissions = createTable("hackathon_submission", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  email: d.varchar({ length: 320 }).notNull(),
  // Normalized IG handle (lowercased, no leading "@").
  handle: d.varchar({ length: 256 }).notNull(),
  projectLink: d.text().notNull(),
  videoLink: d.text(),
  // Whether the entrant consents to us using their video as marketing material.
  marketingConsent: d.boolean().default(false).notNull(),
  notes: d.text(),
  confirmationEmailSent: d.boolean().default(false),
  thankYouEmailSent: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

// One row per hit on a tracking link (e.g. onsen-retreat.com/carson).
// `slug` identifies which link was visited so new links can reuse this table.
export const linkVisits = createTable(
  "link_visit",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 64 }).notNull(),
    ipAddress: d.varchar({ length: 64 }),
    userAgent: d.text(),
    referer: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (t) => [index("link_visit_slug_idx").on(t.slug)],
);

/**
 * Better Auth core tables. Property keys are camelCase because Better Auth
 * expects those exact field names; the drizzle adapter maps models to these
 * tables via the schema object keys in `src/server/auth.ts`.
 */
export const user = createTable("user", (d) => ({
  id: d.text().primaryKey(),
  name: d.text().notNull(),
  email: d.text().notNull().unique(),
  emailVerified: d.boolean().notNull().default(false),
  image: d.text(),
  createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
}));

export const session = createTable(
  "session",
  (d) => ({
    id: d.text().primaryKey(),
    expiresAt: d.timestamp({ withTimezone: true }).notNull(),
    token: d.text().notNull().unique(),
    ipAddress: d.text(),
    userAgent: d.text(),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = createTable(
  "account",
  (d) => ({
    id: d.text().primaryKey(),
    accountId: d.text().notNull(),
    providerId: d.text().notNull(),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: d.text(),
    refreshToken: d.text(),
    idToken: d.text(),
    accessTokenExpiresAt: d.timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: d.timestamp({ withTimezone: true }),
    scope: d.text(),
    // scrypt hash for email/password accounts
    password: d.text(),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = createTable(
  "verification",
  (d) => ({
    id: d.text().primaryKey(),
    identifier: d.text().notNull(),
    value: d.text().notNull(),
    expiresAt: d.timestamp({ withTimezone: true }).notNull(),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

// Persistent rate-limit storage — in-memory counters reset on every
// serverless invocation, so Better Auth is configured to store them here.
export const rateLimit = createTable("rate_limit", (d) => ({
  id: d.text().primaryKey(),
  key: d.text(),
  count: d.integer(),
  lastRequest: d.bigint({ mode: "number" }),
}));

export const artSubmissions = createTable("art_submission", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  email: d.varchar({ length: 320 }).notNull(),
  // Normalized IG handle (lowercased, no leading "@").
  handle: d.varchar({ length: 256 }).notNull(),
  projectLink: d.text().notNull(),
  videoLink: d.text(),
  // Whether the entrant consents to us using their video as marketing material.
  marketingConsent: d.boolean().default(false).notNull(),
  notes: d.text(),
  confirmationEmailSent: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));
