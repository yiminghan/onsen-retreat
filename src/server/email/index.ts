import "server-only";

import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_KEY);

/**
 * Resend audience segment that all waitlist members are added to. Hard-coded
 * (like the Slack webhook) so it works without extra env setup.
 * @see https://resend.com/audience?segmentId=7c2c480e-2d95-4b07-8bf7-3f2be28c02d8
 */
const WAITLIST_SEGMENT_ID = "7c2c480e-2d95-4b07-8bf7-3f2be28c02d8";

function splitName(name?: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) return { firstName: undefined, lastName: undefined };
  const [first, ...rest] = trimmed.split(/\s+/);
  return {
    firstName: first,
    lastName: rest.length > 0 ? rest.join(" ") : undefined,
  };
}

/**
 * Add a contact to the waitlist Resend segment. Idempotent: if the contact
 * already exists, make sure they're in the segment rather than failing.
 * Throws on a genuine failure so callers can log/retry.
 */
export async function addContactToSegment({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const { firstName, lastName } = splitName(name);

  const { error } = await resend.contacts.create({
    email,
    firstName,
    lastName,
    segments: [{ id: WAITLIST_SEGMENT_ID }],
  });

  // No error → contact created and added to the segment.
  if (!error) return;

  // Contact most likely already exists — ensure they're in the segment.
  const { error: segmentError } = await resend.contacts.segments.add({
    email,
    segmentId: WAITLIST_SEGMENT_ID,
  });

  if (segmentError) {
    throw new Error(
      `Failed to add ${email} to Resend segment: ${segmentError.message}`,
    );
  }
}

/**
 * Default sender. Until a custom domain is verified in Resend, use the shared
 * `onboarding@resend.dev` address which works out of the box for testing.
 */
const DEFAULT_FROM = "Onsen Retreat <hi@onsen-retreat.com>";

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

/**
 * Send an email via Resend. Returns the Resend response, throwing on error so
 * callers can handle failures explicitly.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM,
}: SendEmailArgs) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
