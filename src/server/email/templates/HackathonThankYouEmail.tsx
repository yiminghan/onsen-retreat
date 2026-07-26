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

export type HackathonThankYouEmailProps = {
  name?: string | null;
};

export function HackathonThankYouEmail({ name }: HackathonThankYouEmailProps) {

  return (
    <Html>
      <Head />
      <Preview>
        Thank you for submitting to the first ever ONSEN RETREAT Hackathon
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Thank you everyone who submitted a project for our very first
              ONSEN RETREAT Hackathon - we were genuinely blown away by the
              number of submissions.
            </Text>
            <Text style={paragraph}>
              We&apos;ll be reaching out to selected finalists over the next
              two days for interviews, and announce selected participants in
              the following weeks. Whether or not you&apos;re selected, we
              truly hope this application is the start of something you&apos;ll
              continue building.
            </Text>
            <Text style={paragraph}>
              This is only the beginning. We will be planning more retreats in
              the future, including ones that are more technology focused - so
              we can create more opportunities for an even wider range of
              projects.
            </Text>
            <Text style={paragraph}>
              Again, thank you for supporting the first ever ONSEN RETREAT
              Hackathon 🙌 here&apos;s to many more retreats to come.
            </Text>
            <Text style={paragraph}>YiMing</Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you submitted a project
              to the Onsen Retreat hackathon.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default HackathonThankYouEmail;

HackathonThankYouEmail.PreviewProps = {
  name: "YiMing",
} satisfies HackathonThankYouEmailProps;

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
