import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { HackathonSubmissionForm } from "~/components/hackathon-submission-form";

export const metadata: Metadata = {
  title: "Hackathon Submission — Onsen Retreat",
  description:
    "Submit your hackathon project to Onsen Retreat — share your name, project link, and details.",
};

export default function HackathonSubmissionPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-44 pb-28">
        <HackathonSubmissionForm />
      </main>
    </div>
  );
}
