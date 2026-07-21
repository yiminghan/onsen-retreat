import { Suspense } from "react";
import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { ResetPasswordForm } from "~/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — Onsen Retreat",
  description: "Choose a new password for your Onsen Retreat account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        {/* useSearchParams requires a Suspense boundary */}
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
