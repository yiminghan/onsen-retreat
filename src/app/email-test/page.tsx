import { render } from "@react-email/components";

import { ContestAnnouncementEmail } from "~/server/email/templates/ContestAnnouncementEmail";

export default async function EmailTestPage() {
  const html = await render(ContestAnnouncementEmail({ name: "YiMing" }));

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#0F0F0F",
        padding: 24,
      }}
    >
      <iframe
        title="Contest Announcement Email"
        srcDoc={html}
        style={{
          width: "100%",
          maxWidth: 640,
          height: "90dvh",
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
