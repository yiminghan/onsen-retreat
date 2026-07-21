import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { LoginForm } from "~/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — Onsen Retreat",
  description: "Log in to your Onsen Retreat account.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        <LoginForm />
      </main>
    </div>
  );
}
