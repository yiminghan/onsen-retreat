import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type OnboardingEmailProps = {
  name: string;
};

export function OnboardingEmail({ name }: OnboardingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Hi!  Thank you for signing up!
              <br />
              <br />
              You are receiving this email because expressed interest in the ♨️ONSEN RETREAT♨️.
            </Text>
            <Text style={paragraph}>
              We are wrapping up submissions for our first retreat.  Please stay tuned for our second one!
            </Text>
            <Text style={paragraph}>
              In the meantime - please join our <a href="https://discord.gg/6Acme54jn" target="_blank ">discord</a>.
            </Text>

            <Text style={paragraph}>
              YiMing
            </Text>

          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you signed up for Onsen
              Retreat.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OnboardingEmail;

OnboardingEmail.PreviewProps = {
  name: "YiMing",
} satisfies OnboardingEmailProps;

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

const heading: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: 700,
  color: "#18181b",
};

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#3f3f46",
};

const button: React.CSSProperties = {
  display: "inline-block",
  marginTop: "8px",
  padding: "12px 24px",
  backgroundColor: "#18181b",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 600,
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
