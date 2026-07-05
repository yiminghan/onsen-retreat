import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { ArtSubmissionEmail } from "~/server/email/templates/ArtSubmissionEmail";

type ArtSubmissionEmailArgs = {
  to: string;
  name?: string | null;
  handle: string;
};

/**
 * Confirm an art / design contest submission, built with React Email.
 */
export async function sendArtSubmissionEmail({
  to,
  name,
  handle,
}: ArtSubmissionEmailArgs) {
  const component = ArtSubmissionEmail({ name, handle });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "We received your Onsen Retreat art submission",
    html,
    text,
  });
}
