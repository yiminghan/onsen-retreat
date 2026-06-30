import Link from "next/link";

const PROGRAM_DETAILS = [
  { label: "When", value: "October 2026" },
  { label: "Where", value: "Beppu, Japan" },
];

export function Program() {
  return (
    <section
      id="program"
      className="relative flex min-h-dvh scroll-mt-24 flex-col justify-center overflow-hidden border-t border-ink/10 px-6 py-40"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Program
        </h2>

        {/* Phase blocks */}
        <div className="mt-12 space-y-10">
          <div>
            <p className="text-sm font-medium tracking-[0.15em] uppercase">
              <span className="text-flame">Phase One</span>
              <span className="text-ink/60"> · July - August</span>
            </p>
            <ul className="mt-3 space-y-1">
              <li className="flex items-baseline gap-2">
                <Link
                  href="/rules#video-contest"
                  className="text-2xl font-light leading-snug tracking-tight text-ink underline-offset-4 transition-colors hover:text-flame hover:underline"
                >
                  Video Contest
                </Link>
                <span className="text-ink">(2-3 Winners)</span>
                <span className="ml-auto text-xs font-medium tracking-[0.15em] text-flame uppercase">
                  Ongoing
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <Link
                  href="/rules#hackathon"
                  className="text-2xl font-light leading-snug tracking-tight text-ink underline-offset-4 transition-colors hover:text-flame hover:underline"
                >
                  Hackathon
                </Link>

                <span className="ml-auto text-xs font-medium tracking-[0.15em] text-ink/40 uppercase">
                  Coming Soon
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <Link
                  href="/rules#art-design-contest"
                  className="text-2xl font-light leading-snug tracking-tight text-ink underline-offset-4 transition-colors hover:text-flame hover:underline"
                >
                  Art / Design Contest
                </Link>
                <span className="ml-auto text-xs font-medium tracking-[0.15em] text-ink/40 uppercase">
                  Coming Soon
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium tracking-[0.15em] uppercase">
              <span className="text-flame">Phase Two</span>
              <span className="text-ink/60"> · October</span>
            </p>
            <p className="mt-3 text-2xl font-light leading-snug tracking-tight text-ink">
              An immersive one week retreat in Beppu, Japan for 12 finalists to
              focus on their projects.
            </p>
          </div>
        </div>

        {/* When / Where */}
        <dl className="mt-12 space-y-3">
          {PROGRAM_DETAILS.map((detail) => (
            <div key={detail.label} className="flex gap-2 text-lg">
              <dt className="font-medium text-flame">{detail.label}</dt>
              <dd className="text-ink/80">
                <span className="text-ink/40">·</span> {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
