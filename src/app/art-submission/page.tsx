import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { ArtSubmissionForm } from "~/components/art-submission-form";

export const metadata: Metadata = {
  title: "Art / Design Submission — Onsen Retreat",
  description:
    "Submit your art or design entry to Onsen Retreat — share your name, artwork link, and details.",
};

export default function ArtSubmissionPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-44 pb-28">
        <ArtSubmissionForm />
      </main>
    </div>
  );
}
