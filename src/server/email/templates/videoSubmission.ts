import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { VideoSubmissionEmail } from "~/server/email/templates/VideoSubmissionEmail";

type VideoSubmissionEmailArgs = {
  to: string;
  name?: string | null;
  handle: string;
};

/**
 * Confirm a video contest entry, built with React Email.
 */
export async function sendVideoSubmissionEmail({
  to,
  name,
  handle,
}: VideoSubmissionEmailArgs) {
  const component = VideoSubmissionEmail({ name, handle });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "We received your Onsen Retreat video entry",
    html,
    text,
  });
}
