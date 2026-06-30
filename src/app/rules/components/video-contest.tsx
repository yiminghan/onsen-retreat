import { ProseLink, SubHeading } from "./shared";

export function VideoContestGuide() {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <p>
        Make a short reel about the retreat and post it publicly on Instagram.
      </p>

      <SubHeading>How to enter</SubHeading>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Post your reel publicly on Instagram and tag{" "}
          <ProseLink href="https://instagram.com/onsenretreat">
            @onsenretreat
          </ProseLink>
          .
        </li>
        <li>
          (Optional) Drop it in the{" "}
          <ProseLink href="https://discord.gg/fhqu7GY42">
            #video-contest
          </ProseLink>{" "}
          channel in our Discord. (Channel link coming soon.)
        </li>
        <li>
          Register it on our{" "}
          <a
            href="/video-submission"
            className="wrap-break-word underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            official submission form
          </a>{" "}
          with your IG handle.
        </li>
      </ol>

      <SubHeading>What we look for</SubHeading>
      <p>
        This is{" "}
        <span className="font-medium text-ink">not</span> a popularity contest:
        views, likes, and comments don&apos;t decide anything.
        <br />
        <br />
        We&apos;ll select <span className="font-medium text-ink">2–3 winners</span>{" "}
        based on these criterias:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-ink">Good Storytelling</span>
        </li>
        <li>
          <span className="font-medium text-ink">Good Visuals</span>
        </li>
        <li>
          <span className="font-medium text-ink">Authenticity</span>
        </li>
      </ul>

      <SubHeading>Timeline</SubHeading>
      <ul>
        <p>
          Submissions open until July 18, 2026
        </p>
        <p>
          Winners will be announced on July 22, 2026
        </p>
      </ul>


      <SubHeading>Can we participate in the hackathon/creative events too if we posted a video?</SubHeading>
      <p>
        A: Yes!  The winners will be announced before the other events start.
        {" And we welcome everyone even if you just want to join for fun :)"}
      </p>
    </div>
  );
}
