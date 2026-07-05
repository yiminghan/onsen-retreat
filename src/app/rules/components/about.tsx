import { SubHeading } from "./shared";

// Deep-links to another rules guide. The switcher in rules-guides.tsx listens
// for hash changes, so a plain #id anchor swaps the active guide in place.
function SectionLink({ id, label }: { id: string; label: string }) {
  return (
    <>
      (See{" "}
      <a
        href={`#${id}`}
        className="underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        &quot;{label}&quot;
      </a>{" "}
      section.)
    </>
  );
}

export function AboutGuide() {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <p>
        Onsen Retreat is a one-week retreat for students in{" "}
        <span className="font-medium text-ink">Beppu, Japan</span> in October
        2026.
      </p>
      <p>
        We want to create a once-in-a-lifetime experience for young creatives, technologists, and academics to explore their own interests and passion projects.
      </p>

      <SubHeading>How to get selected</SubHeading>

      <ul className="list-disc space-y-6 pl-5">
        <li>
          <span className="font-medium text-ink">Video Contest</span> — make a
          short reel about the retreat and post it publicly on Instagram. We
          select <span className="font-medium text-ink">2-3 winners</span> on
          storytelling, visuals, and authenticity{" "}
          <br />
          <SectionLink id="video-contest" label="Video Contest" />
          <br />
        </li>
        <li>
          <span className="font-medium text-ink">Hackathon</span> — build a
          project over the retreat and demo it. We select{" "}
          <span className="font-medium text-ink">3-4 winners</span> based on concept and creativity.
          <br />
          <SectionLink id="hackathon" label="Hackathon" />
          <br />
        </li>
        <li>
          <span className="font-medium text-ink">Art / Design Contest</span> —
          submit an original piece of art or design. We select{" "}
          <span className="font-medium text-ink">3-4 winners</span> on concept,
          craft, and originality{" "}
          <br />
          <SectionLink id="art-design-contest" label="Art / Design Contest" />
          <br />
        </li>
      </ul>
      <p>
        You don&apos;t need to enter every contest — pick the one that fits you
        best.
      </p>
    </div>
  );
}
