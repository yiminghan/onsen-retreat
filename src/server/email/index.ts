import "server-only";

import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_KEY);

/**
 * Default sender. Until a custom domain is verified in Resend, use the shared
 * `onboarding@resend.dev` address which works out of the box for testing.
 */
const DEFAULT_FROM = "YiMing <hi@onsen-retreat.com>";

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
