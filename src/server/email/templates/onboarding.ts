import { render } from "@react-email/components";

import { sendEmail } from "~/server/email";
import { OnboardingEmail } from "~/server/email/templates/OnboardingEmail";

type OnboardingEmailArgs = {
  to: string;
  name: string;
};

/**
 * Send a simple welcome / onboarding email to a new member, built with React Email.
 */
export async function sendOnboardingEmail({ to, name }: OnboardingEmailArgs) {
  const component = OnboardingEmail({ name });

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ]);

  return sendEmail({
    to,
    subject: "♨️ Thanks for signing up to Onsen Retreat ♨️",
    html,
    text,
  });
}
