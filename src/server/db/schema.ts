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
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("video_submission_handle_idx").on(t.handle)],
);
