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

export type VideoThankYouEmailProps = {
  name?: string | null;
};

export function VideoThankYouEmail({ name }: VideoThankYouEmailProps) {

  return (
    <Html>
      <Head />
      <Preview>
        Thank you for entering the first ever ONSEN RETREAT video contest
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>
              Thank you everyone who entered our very first ONSEN RETREAT
              video contest - we were genuinely blown away by the number of submissions!
            </Text>
            <Text style={paragraph}>
              We&apos;re reviewing every entry now and will announce the
              winners on{" "}
              <a href="https://instagram.com/onsenretreat" target="_blank">
                @onsenretreat
              </a>{" "}
              in the coming days. Whether or not you&apos;re selected, we hope you had as
              much fun making your video as we had watching it.
            </Text>
            <Text style={paragraph}>
              This is only the beginning. We will be planning more retreats
              in the future - so we can create more
              opportunities for even more creatives.
            </Text>
            <Text style={paragraph}>
              Again, thank you for supporting the first ever ONSEN RETREAT
              video contest 🙌 here&apos;s to many more retreats to come.
            </Text>
            <Text style={paragraph}>YiMing</Text>
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

export default VideoThankYouEmail;

VideoThankYouEmail.PreviewProps = {
  name: "YiMing",
} satisfies VideoThankYouEmailProps;

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
