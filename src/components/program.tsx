const PHASES = [
  {
    label: "Phase One",
    when: "July - August",
    body: "Various online competitions to select finalists to fly to Japan.",
  },
  {
    label: "Phase Two",
    when: "October",
    body: "An immersive one week retreat in Beppu, Japan for 12 finalists to focus on their projects.",
  },
];

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
          {PHASES.map((phase) => (
            <div key={phase.label}>
              <p className="text-sm font-medium tracking-[0.15em] uppercase">
                <span className="text-flame">{phase.label}</span>
                <span className="text-ink/60"> · {phase.when}</span>
              </p>
              <p className="mt-3 text-2xl font-light leading-snug tracking-tight text-ink">
                {phase.body}
              </p>
            </div>
          ))}
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
