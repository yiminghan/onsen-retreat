/**
 * Shared retreat vocabulary. Lives in `lib` (not the schema or a router) so the
 * server can build zod enums from it and client components can render the same
 * labels without pulling in server-only modules.
 */

/** Lifecycle of a retreat. Only `draft` retreats are hidden from the public. */
export const RETREAT_STATUSES = [
  "draft",
  "open",
  "closed",
  "completed",
] as const;

export type RetreatStatus = (typeof RETREAT_STATUSES)[number];

export const RETREAT_STATUS_LABELS: Record<RetreatStatus, string> = {
  draft: "Draft",
  open: "Applications open",
  closed: "Applications closed",
  completed: "Completed",
};

export const APPLICATION_STATUSES = [
  "submitted",
  "in_review",
  "waitlisted",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  waitlisted: "Waitlisted",
  accepted: "Accepted",
  rejected: "Not this time",
  withdrawn: "Withdrawn",
};

/** Tailwind classes for the status pill, keyed by application status. */
export const APPLICATION_STATUS_CLASSES: Record<ApplicationStatus, string> = {
  submitted: "border-ink/25 text-ink/70",
  in_review: "border-ink/25 text-ink/70",
  waitlisted: "border-night/30 text-night/80",
  accepted: "border-flame/50 text-flame",
  rejected: "border-ink/15 text-ink/40",
  withdrawn: "border-ink/15 text-ink/40",
};

/**
 * What an application is for. `retreat` is a plain seat request; the other
 * three mirror the contest submission types backfilled from the legacy
 * *_submission tables.
 */
export const APPLICATION_TAGS = [
  "retreat",
  "hackathon",
  "video",
  "art",
] as const;

export type ApplicationTag = (typeof APPLICATION_TAGS)[number];

export const APPLICATION_TAG_LABELS: Record<ApplicationTag, string> = {
  retreat: "Retreat",
  hackathon: "Hackathon",
  video: "Video",
  art: "Art / Design",
};

/** Matches the badge colours already used on /retreat-1. */
export const APPLICATION_TAG_CLASSES: Record<ApplicationTag, string> = {
  retreat: "border-ink/25 text-ink/70",
  hackathon: "border-flame/40 text-flame",
  video: "border-ink/25 text-ink/70",
  art: "border-night/30 text-night/80",
};

/** Roles a participant can hold at a retreat. */
export const PARTICIPANT_ROLES = [
  "organizer",
  "volunteer",
  "participant",
] as const;

export type ParticipantRole = (typeof PARTICIPANT_ROLES)[number];

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  organizer: "Organizer",
  volunteer: "Volunteer",
  participant: "Participant",
};

/**
 * Applications can only be submitted while the retreat is `open` and, when
 * set, before `applicationsCloseAt`.
 */
export const isAcceptingApplications = (retreat: {
  status: string;
  applicationsCloseAt: Date | null;
}) => {
  if (retreat.status !== "open") return false;
  if (!retreat.applicationsCloseAt) return true;
  return retreat.applicationsCloseAt.getTime() > Date.now();
};

/** "Mar 14 – 21, 2026" / "Mar 14, 2026" / null when no dates are set. */
export const formatRetreatDates = (
  startDate: Date | null,
  endDate: Date | null,
) => {
  if (!startDate) return null;

  const day = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const full = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  if (!endDate) return full.format(startDate);

  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  const sameMonth = sameYear && startDate.getUTCMonth() === endDate.getUTCMonth();

  if (sameMonth) {
    return `${day.format(startDate)} – ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`;
  }
  if (sameYear) {
    return `${day.format(startDate)} – ${full.format(endDate)}`;
  }
  return `${full.format(startDate)} – ${full.format(endDate)}`;
};
