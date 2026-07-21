import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ResetPasswordEmailProps = {
  name: string;
  url: string;
};

export function ResetPasswordEmail({ name, url }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Onsen Retreat password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Hi {name},
              <br />
              <br />
              We received a request to reset the password for your Onsen
              Retreat account. Click the button below to choose a new one.
            </Text>
            <Button href={url} style={button}>
              Reset password
            </Button>
            <Text style={paragraph}>
              Or copy and paste this link into your browser:
              <br />
              <Link href={url} style={link}>
                {url}
              </Link>
            </Text>
            <Text style={paragraph}>
              This link expires in 1 hour and can only be used once. If you
              didn&apos;t request a password reset, you can safely ignore this
              email — your password won&apos;t change.
            </Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because a password reset was
              requested for your Onsen Retreat account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;

ResetPasswordEmail.PreviewProps = {
  name: "YiMing",
  url: "http://localhost:3000/reset-password?token=preview-token",
} satisfies ResetPasswordEmailProps;

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

const button: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "16px",
  padding: "12px 24px",
  backgroundColor: "#18181b",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 600,
};

const link: React.CSSProperties = {
  color: "#3f3f46",
  textDecoration: "underline",
  wordBreak: "break-all",
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
