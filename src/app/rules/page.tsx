import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { RulesGuides } from "~/app/rules/components/rules-guides";

export const metadata: Metadata = {
  title: "Rules — Onsen Retreat",
  description:
    "Guides and rules for Onsen Retreat participants — the video contest, visa & travel guidance, and more.",
};

export default function RulesPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 pt-44 pb-28">
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Rules
        </h1>

        <RulesGuides />
      </main>
    </div>
  );
}
