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
          and use #onsenretreat2026 in the description.
        </li>
        <li>
          (Optional) Drop it in the{" "}
          <ProseLink href="https://discord.gg/fhqu7GY42">
            #video-contest
          </ProseLink>{" "}
          channel in our Discord.
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
        based on these criteria:
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

      <SubHeading>What should the video be about?</SubHeading>
      <p>
        A: Please focus on who you are and what kind of projects you want to be doing at the onsen!
        <br />
        We would love to get to know you!
      </p>


      <SubHeading>Can we submit the video as a group?</SubHeading>
      <p>
        A: Group videos are welcome!  Please keep it no more than 2 people as we have limited spots.
      </p>

      <SubHeading>Can we participate in the hackathon/creative events too if we posted a video?</SubHeading>
      <p>
        A: Yes!  The winners will be announced before the other events start.
        <br />
        {"And we welcome everyone even if you just want to join for fun :)"}
      </p>

      <SubHeading>Do you have to make a video to get a chance for the retreat?</SubHeading>
      <p>
        You do not need to make a video if you plan to join the other contests!
      </p>

    </div >
  );
}
