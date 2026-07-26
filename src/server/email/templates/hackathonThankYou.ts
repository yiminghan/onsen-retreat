import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { HackathonThankYouEmail } from "~/server/email/templates/HackathonThankYouEmail";

type HackathonThankYouEmailArgs = {
  to: string;
  name?: string | null;
};

/**
 * Post-hackathon thank-you note to everyone who submitted a project.
 */
export async function sendHackathonThankYouEmail({
  to,
  name,
}: HackathonThankYouEmailArgs) {
  const component = HackathonThankYouEmail({ name });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "Thank you for joining the first ONSEN RETREAT Hackathon 🙌",
    html,
    text,
  });
}
