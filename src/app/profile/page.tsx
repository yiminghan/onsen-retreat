import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { ProfileForm } from "~/components/profile-form";

export const metadata: Metadata = {
  title: "Profile — Onsen Retreat",
  description: "Edit your Onsen Retreat profile.",
};

export default function ProfilePage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-xl px-6 pt-44 pb-28">
        <ProfileForm />
      </main>
    </div>
  );
}
