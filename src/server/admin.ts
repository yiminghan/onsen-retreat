import "server-only";

/**
 * Emails allowed to review retreat applications. Hard-coded (like the Slack
 * webhook in ~/server/slack) so review works without extra env setup — add a
 * reviewer by adding their email here.
 */
const ADMIN_EMAILS = new Set(["hanyiming1995@gmail.com"]);

export const isAdminEmail = (email: string | undefined | null) =>
  !!email && ADMIN_EMAILS.has(email.toLowerCase());
