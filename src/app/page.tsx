import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";

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
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-sand">
        <SiteHeader />

        <Image
          src="/images/branding/beppu_outline.svg"
          alt=""
          width={181}
          height={209}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-0 h-auto w-[40vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-40 select-none"
        />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex w-full max-w-[1100px] flex-col items-center">
            <Image
              src="/onsen-wordmark.svg"
              alt="Onsen Retreat"
              width={801}
              height={372}
              priority
              className="animate-in fade-in slide-in-from-bottom-4 h-auto w-[78vw] max-w-[800px] duration-1000"
            />
            <Link
              href="/signup"
              className="group animate-in fade-in slide-in-from-bottom-3 mt-10 inline-flex items-center gap-2 font-inclusive text-lg font-bold tracking-wide text-ink uppercase underline underline-offset-8 decoration-1 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:decoration-2 hover:underline-offset-[10px] sm:text-xl"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-5 pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between px-6 pb-8 font-inclusive text-lg text-ink duration-1000 sm:px-10 sm:pb-10 sm:text-[32px]">
          <p>
            <span className="font-bold">Beppu</span> Japan
          </p>
          <p>
            <span className="font-bold">2026</span> Oct
          </p>
        </div>
      </section>

      {/* ---------- Philosophy ---------- */}
      <section
        id="experience"
        className="relative scroll-mt-24 overflow-hidden border-t border-ink/10 px-6 py-40"
      >
        {/* Oversized faint kanji anchor */}
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 text-[22rem] leading-none text-ink/[0.04] select-none"
          aria-hidden
        >
          和
        </span>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[0.7rem] font-light tracking-[0.45em] text-ink uppercase">
            Philosophy
          </p>
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-ink/90 sm:text-3xl md:text-2xl">
            We want to create a once-in-a-life experience for young creatives, technologists, and academics to explore their own interests free of distractions
          </p>
          <br />
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-ink/90 sm:text-3xl md:text-2xl">
            By bringing together curious minded individuals in a truly unique environment, we believe we can create a life changing experience that will alter the trajectory of people&apos;s lives
          </p>

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
      </section>

      <SiteFooter />
    </div>
  );
}
