import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { SignupForm } from "~/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up — Onsen Retreat",
  description:
    "Join the waitlist for the Onsen Retreat — a one-week onsen retreat for people who just need to finish the thing.",
};

export default function SignupPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        <SignupForm />
      </main>
    </div>
  );
}
