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

export type ContestAnnouncementEmailProps = {
  name?: string | null;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://onsen-retreat.com";

type Contest = {
  title: string;
  blurb: string;
  deadline: string;
  ctaLabel: string;
  ctaHref: string;
};

function buildContests(baseUrl: string): Contest[] {
  return [
    {
      title: "Video Contest (2-3 Winners)",
      blurb:
        "Make a short reel about the retreat and post it publicly on Instagram.",
      deadline: "Jul 18",
      ctaLabel: "Details",
      ctaHref: `${baseUrl}/rules#video-contest`,
    },
    {
      title: "Hackathon (3-4 Winners)",
      blurb:
        "Build a project and make a casual demo video — who you are, your story, what you're building, and why it matters.",
      deadline: "Jul 22",
      ctaLabel: "Details",
      ctaHref: `${baseUrl}/rules#hackathon`,
    },
    {
      title: "Art / Design Contest (3-4 Winners)",
      blurb:
        "Theme: PASSION. Submit any original art form — drawings, design, music, comics, (surprise us!).",
      deadline: "Jul 28",
      ctaLabel: "Details",
      ctaHref: `${baseUrl}/rules#art-design-contest`,
    },
  ];
}

function ContestBlock({ title, blurb, deadline, ctaLabel, ctaHref }: Contest) {
  return (
    <Section style={contestBlock}>
      <Text style={contestTitle}>{title}</Text>
      <Text style={contestBlurb}>{blurb}</Text>
      <Text style={contestMeta}>

        <a href={ctaHref} target="_blank" style={link}>
          {ctaLabel} →
        </a>
      </Text>
    </Section>
  );
}

export function ContestAnnouncementEmail({
  name,
  baseUrl = DEFAULT_BASE_URL,
}: ContestAnnouncementEmailProps) {
  const greeting = name?.trim() ? name.trim() : "there";
  const contests = buildContests(baseUrl);

  return (
    <Html>
      <Head />
      <Preview>Three ways into the Onsen Retreat — pick yours</Preview>
      <Body style={main}>
        <Container style={container}>

          <Section style={content}>
            <Text style={paragraph}>
              Hi {greeting}! 👋
              <br />
              <br />
              You are receiving this email because expressed interest in the ♨️ONSEN RETREAT♨️.
              <br />
              <br />
              The retreat is one week in Beppu for young
              creatives, technologists, and academics — and there are three
              ways to earn your spot:
            </Text>

            {contests.map((contest) => (
              <ContestBlock key={contest.title} {...contest} />
            ))}

            <Text style={paragraph}>
              Each one is its own contest, so you don&apos;t
              need to enter them all. Pick the one that fits you best.
              <br />
              <br />
              Also don&apos;t forget to come hang out in our{" "}
              <a
                href="https://discord.gg/fhqu7GY42"
                target="_blank"
                style={link}
              >
                Discord
              </a>{" "}
              — I&apos;m around and happy to help.
            </Text>
            <Text style={paragraph}>YiMing</Text>
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

export default ContestAnnouncementEmail;

ContestAnnouncementEmail.PreviewProps = {
  name: "YiMing",
} satisfies ContestAnnouncementEmailProps;

const SAND = "#EEEDE3";
const INK = "#0F0F0F";
const FLAME = "#FF7100";

const main: React.CSSProperties = {
  backgroundColor: SAND,
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  padding: "32px 0",
};

const container: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
  backgroundColor: SAND,
};

const content: React.CSSProperties = {
  padding: "24px 40px 8px 40px",
};

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
  lineHeight: "1.6",
  color: INK,
};

const link: React.CSSProperties = {
  color: FLAME,
  fontWeight: 600,
  textDecoration: "underline",
};

const contestBlock: React.CSSProperties = {
  margin: "0 0 24px 0",
};

const contestTitle: React.CSSProperties = {
  margin: "0",
  fontSize: "18px",
  fontWeight: 700,
  color: INK,
};

const contestBlurb: React.CSSProperties = {
  margin: "6px 0 8px 0",
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#3f3f46",
};

const contestMeta: React.CSSProperties = {
  margin: "0",
  fontSize: "14px",
  color: INK,
};

const divider: React.CSSProperties = {
  borderColor: "#E2E0D4",
  margin: "8px 40px 0 40px",
};

const footer: React.CSSProperties = {
  padding: "20px 40px 32px 40px",
};

const footerText: React.CSSProperties = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#8a887c",
};
