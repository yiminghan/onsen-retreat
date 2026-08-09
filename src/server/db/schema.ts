import {
  index,
  pgEnum,
  pgTableCreator,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
    rejected: d.boolean().default(false),
    rejectionEmailText: d.text(),
    rejectionEmailSent: d.boolean().default(false),
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
  rejected: d.boolean().default(false),
  rejectionEmailText: d.text(),
  rejectionEmailSent: d.boolean().default(false),
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

// Retreat membership profile — one row per user, editable on /profile.
// Social handles are normalized (lowercased, no leading "@" or URL).
export const membership = createTable(
  "membership",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    bio: d.text(),
    instagram: d.varchar({ length: 256 }),
    twitter: d.varchar({ length: 256 }),
    linkedin: d.varchar({ length: 256 }),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [uniqueIndex("membership_user_id_idx").on(t.userId)],
);

// Persistent rate-limit storage — in-memory counters reset on every
// serverless invocation, so Better Auth is configured to store them here.
export const rateLimit = createTable("rate_limit", (d) => ({
  id: d.text().primaryKey(),
  key: d.text(),
  count: d.integer(),
  lastRequest: d.bigint({ mode: "number" }),
}));

/**
 * A single edition of the retreat (Retreat 001, 002, …). `slug` is the public
 * URL segment under /retreats. `status` follows RETREAT_STATUSES in
 * ~/lib/retreat — `draft` editions are hidden from the public pages.
 */
export const retreats = createTable(
  "retreat",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 128 }).notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    location: d.varchar({ length: 256 }),
    startDate: d.timestamp({ withTimezone: true }),
    endDate: d.timestamp({ withTimezone: true }),
    // Null means uncapped.
    capacity: d.integer(),
    coverImage: d.text(),
    status: d.varchar({ length: 32 }).notNull().default("draft"),
    // Soft-delete flag — "deleted" retreats keep their rows (and applications)
    // but are excluded from all queries.
    deleted: d.boolean().notNull().default(false),
    applicationsCloseAt: d.timestamp({ withTimezone: true }),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    uniqueIndex("retreat_slug_idx").on(t.slug),
    index("retreat_status_idx").on(t.status),
  ],
);

/**
 * One application per user per retreat, tagged by what it's for — a retreat
 * seat, a hackathon build, a video, a piece of art. The three legacy
 * *_submission tables are backfilled into this one (see
 * scripts/backfill-retreat-applications.ts); those entries predate accounts, so
 * `userId` is nullable and identity can live inline instead.
 *
 * `status` follows APPLICATION_STATUSES and `tag` follows APPLICATION_TAGS, both
 * in ~/lib/retreat. Accepting an application creates the matching
 * `retreatParticipants` row.
 */
export const retreatApplications = createTable(
  "retreat_application",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    retreatId: d
      .integer()
      .notNull()
      .references(() => retreats.id, { onDelete: "cascade" }),
    // Null for backfilled contest entries with no matching account.
    userId: d.text().references(() => user.id, { onDelete: "cascade" }),
    // Identity as given on the original form — for account-less entries this is
    // the only identity there is. Signed-in applicants read from `user`.
    applicantName: d.varchar({ length: 256 }),
    applicantEmail: d.varchar({ length: 320 }),
    // Normalized IG handle (lowercased, no leading "@").
    applicantHandle: d.varchar({ length: 256 }),
    tag: d.varchar({ length: 32 }).notNull().default("retreat"),
    status: d.varchar({ length: 32 }).notNull().default("submitted"),
    // Why they want in, and what they'd build/bring. Null on backfilled
    // entries, which had no such field.
    motivation: d.text(),
    project: d.text(),
    // The build / artwork / repo.
    projectLink: d.text(),
    // Every video link lands here regardless of where it came from: a video
    // entry's submission link, or a hackathon/art entry's demo video.
    videoLink: d.text(),
    // Whether the entrant consents to us using their entry as marketing material.
    marketingConsent: d.boolean().notNull().default(false),
    notes: d.text(),
    // Internal, never returned to the applicant.
    reviewNotes: d.text(),
    // Which transactional emails this entry has already been sent, carried over
    // from the legacy *_submission tables so we don't re-send on a re-run.
    confirmationEmailSent: d.boolean().notNull().default(false),
    thankYouEmailSent: d.boolean().notNull().default(false),
    rejectionEmailText: d.text(),
    rejectionEmailSent: d.boolean().notNull().default(false),
    // Provenance of backfilled rows ("art_submission", 42). Null for
    // applications made through the retreat form; the unique index below makes
    // the backfill safe to re-run.
    sourceTable: d.varchar({ length: 64 }),
    sourceId: d.integer(),
    decidedAt: d.timestamp({ withTimezone: true }),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    // Postgres treats NULLs as distinct, so this caps signed-in members at one
    // application per retreat while letting account-less entries pile up.
    uniqueIndex("retreat_application_retreat_user_idx").on(
      t.retreatId,
      t.userId,
    ),
    uniqueIndex("retreat_application_source_idx").on(t.sourceTable, t.sourceId),
    index("retreat_application_retreat_idx").on(t.retreatId),
    index("retreat_application_user_idx").on(t.userId),
    index("retreat_application_tag_idx").on(t.tag),
  ],
);

export const participantRoleEnum = pgEnum("onsen_participant_role", [
  "organizer",
  "volunteer",
  "participant",
]);


export const retreatParticipants = createTable(
  "retreat_participant",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    retreatId: d
      .integer()
      .notNull()
      .references(() => retreats.id, { onDelete: "cascade" }),
    membershipId: d
      .integer()
      .notNull()
      .references(() => membership.id, { onDelete: "cascade" }),
    role: participantRoleEnum().notNull().default("participant"),
    createdAt: d.timestamp({ withTimezone: true }).notNull().defaultNow(),
  }),
  (t) => [
    uniqueIndex("retreat_participant_retreat_membership_idx").on(
      t.retreatId,
      t.membershipId,
    ),
    index("retreat_participant_retreat_idx").on(t.retreatId),
  ],
);

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
  rejected: d.boolean().default(false),
  rejectionEmailText: d.text(),
  rejectionEmailSent: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));
