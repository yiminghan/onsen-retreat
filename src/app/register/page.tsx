import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { RegisterForm } from "~/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account — Onsen Retreat",
  description: "Create your Onsen Retreat account.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        <RegisterForm />
      </main>
    </div>
  );
}
