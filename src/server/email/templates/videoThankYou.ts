import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { VideoThankYouEmail } from "~/server/email/templates/VideoThankYouEmail";

type VideoThankYouEmailArgs = {
  to: string;
  name?: string | null;
};

/**
 * Post-contest thank-you note to everyone who entered the video contest.
 */
export async function sendVideoThankYouEmail({
  to,
  name,
}: VideoThankYouEmailArgs) {
  const component = VideoThankYouEmail({ name });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "Thank you for entering first ever ONSEN RETREAT video contest 🙌",
    html,
    text,
  });
}
