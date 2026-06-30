import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type VideoSubmissionEmailProps = {
  name?: string | null;
  handle: string;
};

export function VideoSubmissionEmail({
  name,
  handle,
}: VideoSubmissionEmailProps) {
  const greeting = name?.trim() ? name.trim() : `@${handle}`;

  return (
    <Html>
      <Head />
      <Preview>We got your video entry</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Hi {greeting}! 🎬
              <br />
              <br />
              Your entry for the ONSEN RETREAT video contest is in — thanks
              for submitting. We&apos;ve logged it under{" "}
              <strong>@{handle}</strong>.
            </Text>
            <Text style={paragraph}>
              A quick reminder of how it works: winners are picked on{" "}
              <strong>creativity</strong> — your storytelling and visuals — not
              views or likes. We&apos;ll select 2–3 winners and annouce them by end of July.
            </Text>
            <Text style={paragraph}>
              If you haven&apos;t already, make sure your reel is public and
              tagged{" "}
              <a href="https://instagram.com/onsenretreat" target="_blank">
                @onsenretreat
              </a>{" "}, and feel free to drop it in our{" "}
              <a href="https://discord.gg/fhqu7GY42" target="_blank">
                Discord
              </a>{" "}
              too for any questions.
            </Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you entered the Onsen
              Retreat video contest.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default VideoSubmissionEmail;

VideoSubmissionEmail.PreviewProps = {
  name: "YiMing",
  handle: "onsenretreat",
} satisfies VideoSubmissionEmailProps;

const main: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  padding: "32px 0",
};

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
};

const content: React.CSSProperties = {
  padding: "40px 40px 24px 40px",
};

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#3f3f46",
};

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "0",
};

const footer: React.CSSProperties = {
  padding: "24px 40px 40px 40px",
};

const footerText: React.CSSProperties = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#a1a1aa",
};
