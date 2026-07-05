import { SubHeading } from "./shared";

export function ContestGuide({ submissionHref }: { submissionHref: string }) {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <SubHeading>How to enter</SubHeading>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Make a casual video about your project.
        </li>
        <li>
          Register it on our{" "}
          <a
            href={submissionHref}
            className="wrap-break-word underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            official submission form
          </a>
          .
        </li>
      </ol>

      <SubHeading>What should the video be about?</SubHeading>
      <ul className="list-disc space-y-2 pl-5">
        <li>Who you are</li>
        <li>Where you are from</li>
        <li>What&apos;s your story</li>
        <li>What project you are building</li>
        <li>Why it matters to you</li>
        <li>How you built it / tools used</li>
      </ul>

      <SubHeading>Timeline</SubHeading>
      <ul>
        <p>Submissions open until July 22, 2026</p>
        <p>Online demos will begin July 31, 2026</p>
      </ul>

      <SubHeading>Can we submit the video as a group?</SubHeading>
      <p>
        A: Group videos are welcome! Please keep no more than 2 people as we
        have limited spots.
      </p>

      <SubHeading>Can we use an existing project?</SubHeading>
      <p>
        A: Yes!  As long as you want to keep working on it, you can use an existing project.
      </p>

      <SubHeading>Can we use AI in our projects?</SubHeading>
      <p>
        A: Yes!  Feel free to using AI tools to help.
      </p>

      <SubHeading>What do you guys look for?</SubHeading>
      <p>
        A big also part of what we look for is why you are passionate about the project and why you want to work on it,
        so even if you don&apos;t think it&apos;s perfect, we would still love to see it as long as you show your passion and love!
      </p>
    </div>
  );
}
