import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { VideoSubmissionForm } from "~/components/video-submission-form";

export const metadata: Metadata = {
  title: "Video Contest Submission — Onsen Retreat",
  description:
    "Submit your entry to the Onsen Retreat video contest — register your Instagram reel with your handle. One entry per person.",
};

export default function VideoSubmissionPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-44 pb-28">
        <VideoSubmissionForm />
      </main>
    </div>
  );
}
