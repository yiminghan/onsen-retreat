import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { ResetPasswordEmail } from "~/server/email/templates/ResetPasswordEmail";

type ResetPasswordArgs = {
  to: string;
  name: string;
  url: string;
};

/**
 * Send the Better Auth password-reset link, built with React Email.
 */
export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: ResetPasswordArgs) {
  const component = ResetPasswordEmail({ name, url });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "Reset your password — Onsen Retreat",
    html,
    text,
  });
}
