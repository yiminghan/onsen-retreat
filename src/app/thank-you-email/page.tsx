import { render } from "@react-email/components";
import { notFound } from "next/navigation";

import { HackathonThankYouEmail } from "~/server/email/templates/HackathonThankYouEmail";
import { VideoThankYouEmail } from "~/server/email/templates/VideoThankYouEmail";
import {
  SendThankYouEmails,
  SendVideoThankYouEmails,
} from "./send-thank-you-emails";

export default async function ThankYouEmailPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [hackathonHtml, videoHtml] = await Promise.all([
    render(HackathonThankYouEmail({ name: null })),
    render(VideoThankYouEmail({ name: null })),
  ]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#0F0F0F",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <SendThankYouEmails />
      <iframe
        title="Hackathon Thank You Email"
        srcDoc={hackathonHtml}
        style={{
          width: "100%",
          maxWidth: 640,
          height: "80dvh",
          margin: "0 auto",
          display: "block",
          border: "none",
          borderRadius: 12,
          background: "#fff",
        }}
      />
      <SendVideoThankYouEmails />
      <iframe
        title="Video Contest Thank You Email"
        srcDoc={videoHtml}
        style={{
          width: "100%",
          maxWidth: 640,
          height: "80dvh",
          margin: "0 auto",
          display: "block",
          border: "none",
          borderRadius: 12,
          background: "#fff",
        }}
      />
    </main>
  );
}
