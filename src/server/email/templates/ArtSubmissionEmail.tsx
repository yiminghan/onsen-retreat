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

export type ArtSubmissionEmailProps = {
  name?: string | null;
  handle: string;
};

export function ArtSubmissionEmail({ name, handle }: ArtSubmissionEmailProps) {
  const greeting = name?.trim() ? name.trim() : `@${handle}`;

  return (
    <Html>
      <Head />
      <Preview>We got your art submission</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Hi {greeting}! 🎨
              <br />
              <br />
              Your submission for the ONSEN RETREAT art / design contest is in —
              thanks for sharing your work. We&apos;ve logged it and our team
              will take it from here.
            </Text>
            <Text style={paragraph}>
              We&apos;ll be in touch by email with any next steps. If you need to
              update anything about your submission, just reply to this email.
            </Text>
            <Text style={paragraph}>
              In the meantime, feel free to drop by our{" "}
              <a href="https://discord.gg/fhqu7GY42" target="_blank">
                Discord
              </a>{" "}
              for any questions.
            </Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you submitted work to the
              Onsen Retreat art / design contest.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ArtSubmissionEmail;

ArtSubmissionEmail.PreviewProps = {
  name: "YiMing",
  handle: "onsenretreat",
} satisfies ArtSubmissionEmailProps;

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
