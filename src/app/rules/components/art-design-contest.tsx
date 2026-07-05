
import { ProseLink, SubHeading } from "./shared";

export function ArtDesignContestGuide() {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <SubHeading>How to enter</SubHeading>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Make a casual video about your art.
        </li>
        <li>
          Post your work publicly on Instagram and tag{" "}
          <ProseLink href="https://instagram.com/onsenretreat">
            @onsenretreat
          </ProseLink>{" "}
          with #onsenretreat2026 in the description.
        </li>
        <li>
          Register it on our{" "}
          <a
            href={"/art-submission"}
            className="wrap-break-word underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            official art submission form
          </a>
          .
        </li>
      </ol>

      <SubHeading>What should the art be about?</SubHeading>
      <p>
        {`The theme is "PASSION"`}
      </p>
      <p>
        You can submit any art form you want - drawings, designs, music, comic, (suprise us!).
      </p>


      <SubHeading>Timeline</SubHeading>
      <ul>
        <p>Submissions open until July 28, 2026</p>
        <p>Winners will be selected Aug 7, 2026</p>
      </ul>
      <p>
        We&apos;ll select <span className="font-medium text-ink">3-4 winners</span>.
      </p>

      <SubHeading>Can we submit as a group?</SubHeading>
      <p>
        A: Please keep no more than 2 people as we have limited spots.
      </p>

      <SubHeading>Can we use AI in our projects?</SubHeading>
      <p>
        A: We do not accept AI art.
      </p>
    </div>
  );
}

