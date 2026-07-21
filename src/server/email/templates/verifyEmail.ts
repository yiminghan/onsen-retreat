import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { VerifyEmailEmail } from "~/server/email/templates/VerifyEmailEmail";

type VerifyEmailArgs = {
  to: string;
  name: string;
  url: string;
};

/**
 * Send the Better Auth email-verification link, built with React Email.
 */
export async function sendVerifyEmail({ to, name, url }: VerifyEmailArgs) {
  const component = VerifyEmailEmail({ name, url });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "Verify your email ♨️ Onsen Retreat",
    html,
    text,
  });
}
