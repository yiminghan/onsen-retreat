import { ProseLink, SubHeading } from "./shared";

export function VisaGuide() {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <SubHeading>Do you need a visa?</SubHeading>
      <p>
        A one-week retreat in October is a short-term stay, which for most
        travelers means no visa is required.  Check your passport on the official list:{" "}
        <ProseLink href="https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html">
          mofa.go.jp/j_info/visit/visa/short/novisa.html
        </ProseLink>
      </p>
      <p>
        <span className="font-medium text-ink underline">Non-exempt nationals:</span>{" "}
        You&apos;ll need a short-term &ldquo;Temporary Visitor&rdquo; visa and you will be responsible for securing the visa.
        We will announce winners by early Aug so you should have 2 months to get your visa.
        We will also try our best to help you in the process.
      </p>

      <SubHeading>What to have ready (everyone)</SubHeading>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          A passport valid for at least 6 months beyond your travel dates.
        </li>
        <li>
          Accommodation details and a rough itinerary (we&apos;ll provide
          retreat confirmation you can show).
        </li>
        <li>A return or onward ticket within your permitted stay. (we&apos;ll provide) </li>
        <li>Proof of sufficient funds for your stay (occasionally requested).</li>
      </ul>
    </div>
  );
}
