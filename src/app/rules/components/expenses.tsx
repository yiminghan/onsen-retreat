import { SubHeading } from "./shared";

export function ExpensesGuide() {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">

      <SubHeading>What we cover (students)</SubHeading>
      <p>
        If you&apos;re an actively enrolled student selected to attend, we cover the
        major expenses:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-ink">Accommodation</span> — your hotel
          / retreat lodging for the stay.
        </li>
        <li>
          <span className="font-medium text-ink">Travel</span> — getting to and
          from Japan for the retreat.
        </li>
      </ul>
      We will reach out to all winners privately to work on the logistics.

      <SubHeading>What&apos;s not covered</SubHeading>
      <p>
        Miscellaneous and personal expenses are your own responsibility, for
        example:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Your own food and meals that aren&apos;t part of the retreat.</li>
        <li>Personal shopping, souvenirs, and incidentals.</li>
        <li>Anything outside the planned retreat activities.</li>
      </ul>

      <SubHeading>Non-students</SubHeading>
      <p>
        Expenses are <span className="font-medium text-ink">not covered</span> for
        non-students unless explicitly stated otherwise.
      </p>
    </div>
  );
}
