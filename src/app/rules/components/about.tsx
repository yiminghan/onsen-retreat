import { SubHeading } from "./shared";

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

      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-ink">Video Contest</span> — make a
          short reel about the retreat and post it publicly on Instagram. We
          select winners on storytelling, visuals, and authenticity {`(See "Video Contest" section.)`}
        </li>
        <li>
          <span className="font-medium text-ink">Hackathon</span> and{" "}
          <span className="font-medium text-ink">Art / Design Contest</span> —
          enter one of the creative contests with your own work. (More details coming soon)
        </li>
      </ul>
      <p>
        You don&apos;t need to enter every contest — pick the one that fits you
        best.
      </p>
    </div>
  );
}
