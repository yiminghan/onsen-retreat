import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { HackathonSubmissionEmail } from "~/server/email/templates/HackathonSubmissionEmail";

type HackathonSubmissionEmailArgs = {
  to: string;
  name?: string | null;
  handle: string;
};

/**
 * Confirm a hackathon project submission, built with React Email.
 */
export async function sendHackathonSubmissionEmail({
  to,
  name,
  handle,
}: HackathonSubmissionEmailArgs) {
  const component = HackathonSubmissionEmail({ name, handle });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "We received your Onsen Retreat hackathon submission",
    html,
    text,
  });
}
