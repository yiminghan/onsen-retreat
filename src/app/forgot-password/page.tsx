import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password — Onsen Retreat",
  description: "Reset your Onsen Retreat password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
