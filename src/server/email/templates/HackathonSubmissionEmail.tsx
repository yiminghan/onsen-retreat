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

export type HackathonSubmissionEmailProps = {
  name?: string | null;
  handle: string;
};

export function HackathonSubmissionEmail({
  name,
  handle,
}: HackathonSubmissionEmailProps) {
  const greeting = name?.trim() ? name.trim() : `@${handle}`;

  return (
    <Html>
      <Head />
      <Preview>We got your hackathon submission</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Hi {greeting}! 🚀
              <br />
              <br />
              Your project submission for the ONSEN RETREAT hackathon is in —
              thanks for building with us. We&apos;ve logged it and our team will
              take it from here.
            </Text>
            <Text style={paragraph}>
              We&apos;ll be in touch by email with any next steps. If you need to
              update anything about your submission, contact @onsenretreat on instagram.
            </Text>
            <Text style={paragraph}>
              In the meantime, feel free to drop by our{" "}
              <a href="https://discord.gg/RPX25Cvvj" target="_blank">
                Discord
              </a>{" "}
              for any questions.
            </Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you submitted a project to
              the Onsen Retreat hackathon.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default HackathonSubmissionEmail;

HackathonSubmissionEmail.PreviewProps = {
  name: "YiMing",
  handle: "onsenretreat",
} satisfies HackathonSubmissionEmailProps;

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
