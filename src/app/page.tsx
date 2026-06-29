import Image from "next/image";

import { Hero } from "~/components/hero";
import { SiteFooter } from "~/components/site-footer";
import { PreviousStack } from "~/components/previous-stack";
import Link from "next/link";

const FAQS = [
  {
    q: "Why are we doing this?",
    a: `See "Why?" section in the page header.`
  },
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
  }
];

export default function Home() {
  return (
    <div className="bg-sand text-ink">
      {/* ---------- Hero ---------- */}
      <Hero />

      {/* ---------- Philosophy ---------- */}
      <section
        id="experience"
        className="relative scroll-mt-24 overflow-hidden bg-ink px-6 py-40"
      >
        {/* Oversized faint asterisk anchor */}
        <Image
          src="/onsen-asterisk.svg"
          alt=""
          width={32}
          height={32}
          aria-hidden
          style={{ filter: "invert(1)", opacity: 0.05 }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-auto w-[26rem] max-w-[60vw] -translate-x-1/2 -translate-y-1/2 select-none"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-10 font-display text-3xl tracking-tight text-sand sm:text-4xl">
            Philosophy
          </h2>
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-sand/90 sm:text-3xl md:text-2xl">
            We want to create a once-in-a-life experience for young creatives, technologists, and academics to explore their own interests free of distractions
          </p>
          <br />
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-sand/90 sm:text-3xl md:text-2xl">
            By bringing together curious minded individuals in a truly unique environment, we believe we can create a life changing experience that will alter the trajectory of people&apos;s lives
          </p>

        </div>
      </section>

      {/* ---------- Why ---------- */}
      <section
        id="why"
        className="relative scroll-mt-24 overflow-hidden border-t border-ink/10 px-6 py-40"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-x-16 gap-y-14 md:grid-cols-2">
          {/* Story */}
          <div className="prose-onsen relative">
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Why
            </h2>
            <div className="mt-8 space-y-6 text-lg font-light leading-relaxed tracking-wide text-ink/75">
              <p>
                Two years ago, through sheer randomness, I went on a one-week onsen retreat that changed my life.
              </p>
              <p>
                We would build, hike, chill in the onsen, and talk about technology. It was my first taste of what a nomadic lifestyle could look like, and it completely changed my worldview.
              </p>
              <p>
                This year, I want to organize a similar retreat during reading week so that students can experience the same transformation.
              </p>
              <p>
                You can be a designer, a creative, a programmer, a writer, or even a marketer—just bring your project, and prepare to lock in for one week in a small Japanese onsen town.
              </p>
            </div>
          </div>

          {/* Photo deck */}
          <div className="relative flex justify-center">
            <PreviousStack />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-ink/10 px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.6fr]">
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
        <div className="relative flex flex-col items-center gap-6 text-center mt-20">
          <Link
            href="/signup"
            className="border-b border-ink/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ink/80 uppercase transition-colors hover:border-ink hover:text-ink"
          >
            Sign Up
          </Link>
        </div>
      </section>

    </div>
  );
}
