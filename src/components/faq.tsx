import Link from "next/link";

const FAQS = [
  {
    q: "Who is this for?",
    a: "You can be a designer, a creative, a programmer, a writer, all we ask is that you bring something interesting to work on.",
  },
  {
    q: "How long is the program?",
    a: "One week, but plan for 8-9 days for travel buffer.",
  },
  {
    q: "Where does it take place?",
    a: "Beppu, Japan.  It's a vibrant seaside city known as the country's onsen capital.",
  },
  {
    q: "When does it take place?",
    a: "Oct 2026. Exact dates and details are still TBD based on the interest and budget we can secure.",
  },
  {
    q: "Can I join if I'm not a student?",
    a: "Absolutely! We will prioritize subsidizing the cost for students, but non-students are welcome to join with their own trip expense.",
  },
  {
    q: "Are you accepting sponsors?",
    a: "Yes. We are looking for a few select sponsors to help cover the costs, so please email me if you align w/ our mission and are interested in getting massive marketing exposure.",
    email: "hanyiming1995@gmail.com",
  },
];

export function Faq() {
  return (
    <section className="flex min-h-dvh flex-col justify-center border-t border-ink/10 px-6 py-32">
      <div className="mx-auto grid max-w-3xl gap-x-10 gap-y-12 md:grid-cols-[1fr_1.6fr]">
        <div className="md:sticky md:top-32 md:self-start">
          <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            FAQ
          </h2>
        </div>

        <dl className="border-t border-ink/10">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="border-b border-ink/10 py-8 md:grid md:grid-cols-[1fr_1.4fr] md:gap-10"
            >
              <dt className="text-base font-light tracking-wide text-ink">
                {faq.q}
              </dt>
              <dd className="mt-3 text-sm font-light leading-relaxed text-ink/60 md:mt-0">
                {faq.a}
                {faq.email && (
                  <>
                    {" "}
                    <a
                      href={`mailto:${faq.email}`}
                      className="text-ink/70 underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      {faq.email}
                    </a>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative mt-20 flex flex-col items-center gap-6 text-center">
        <Link
          href="/signup"
          className="border-b border-ink/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ink/80 uppercase transition-colors hover:border-ink hover:text-ink"
        >
          Sign Up
        </Link>
      </div>
    </section>
  );
}
