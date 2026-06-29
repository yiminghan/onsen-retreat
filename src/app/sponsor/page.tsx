import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";

export const metadata: Metadata = {
  title: "Sponsor — Onsen Retreat",
  description: "Sponsorship inquiries for the Onsen Retreat.",
};

export default function SponsorPage() {
  return (
    <div className="relative min-h-screen bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto flex min-h-dvh max-w-3xl items-center justify-center px-6">
        <div className="prose-onsen relative space-y-7 text-lg font-light leading-relaxed tracking-wide text-ink/75 text-center">
          <p>
            Please email{" "}
            <a
              href="mailto:hanyiming1995@gmail.com"
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              hanyiming1995@gmail.com
            </a>{" "}
            for sponsorship inquiries.
          </p>
        </div>
      </main>

    </div>
  );
}
