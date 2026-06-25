import Balancer from "react-wrap-balancer";

import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { SignupDialog } from "~/components/signup-dialog";

// Stock onsen-mood footage (serene forest waterfall). Swap with your own clip
// by dropping a file in /public and pointing this at it.
const HERO_VIDEO = "/onsen-poster.mp4"
// "https://videos.pexels.com/video-files/6981411/6981411-hd_1920_1080_25fps.mp4";

const PILLARS = [
  {
    kanji: "湯",
    label: "The Springs",
    body: "Mineral water drawn from deep volcanic sources, held at the exact temperature the body forgets itself in.",
  },
  {
    kanji: "霧",
    label: "The Steam",
    body: "Mist that hangs in the morning air and softens every edge — the world dissolved to warmth and sound.",
  },
  {
    kanji: "静",
    label: "The Silence",
    body: "No screens, no schedules. Only the long, deliberate quiet between the sounds of falling water.",
  },
];

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
    a: "Location TBD, but it will be a small onsen town a few hours from Tokyo.",
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
    <div className="bg-night text-steam">
      {/* ---------- Hero ---------- */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          poster="/onsen-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-night/20" />

        <SiteHeader variant="overlay" />

        {/* Vertical kanji accent — an Izanami signature */}
        <span
          className="absolute top-1/2 left-8 z-20 hidden -translate-y-1/2 text-sm tracking-[0.5em] text-steam/40 [writing-mode:vertical-rl] lg:block"
          aria-hidden
        >
          温泉 · 静寂
        </span>

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="animate-in fade-in slide-in-from-bottom-5 mt-8 text-[0.7rem] font-light tracking-[0.45em] text-ember uppercase duration-1000">
            Oct 2026
          </p>
          <h1 className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl text-5xl font-extralight leading-[1.1] tracking-tight text-steam duration-1000 sm:text-7xl md:text-[5.5rem]">
            <Balancer>An Experimental One Week Program</Balancer>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-5 mt-10 max-w-xl text-base font-light leading-relaxed tracking-wide text-steam/70 duration-1000 sm:text-lg">
            <Balancer>
              Bring your project and lock in for one week at a remote onsen town
              with no distractions.
            </Balancer>
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-6 mt-12 duration-1000">
            <SignupDialog>
              <button className="border-b border-ember pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ember uppercase transition-colors hover:text-steam">
                Sign Up
              </button>
            </SignupDialog>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center">
          <span className="text-[0.7rem] tracking-[0.35em] text-steam/50 uppercase">
            Scroll
          </span>
        </div>
      </section>

      {/* ---------- Philosophy ---------- */}
      <section className="relative overflow-hidden border-t border-onsen/10 px-6 py-40">
        {/* Oversized faint kanji anchor */}
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 text-[22rem] leading-none text-steam/[0.03] select-none"
          aria-hidden
        >
          和
        </span>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[0.7rem] font-light tracking-[0.45em] text-onsen uppercase">
            Philosophy
          </p>
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-steam/90 sm:text-3xl md:text-2xl">
            We want to create a once-in-a-life experience for young creatives, technologists, and academics to explore their own interests free of distractions
          </p>
          <br />
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-steam/90 sm:text-3xl md:text-2xl">
            By bringing together curious minded individuals in a truly unique environment, we believe we can create a life changing experience that will alter the trajectory of people&apos;s lives
          </p>

        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-onsen/10 px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-32 md:self-start">
            <h2 className="text-3xl font-extralight leading-[1.15] tracking-tight text-steam sm:text-4xl">
              FAQ
            </h2>
          </div>

          <dl className="border-t border-onsen/10">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="border-b border-onsen/10 py-8 md:grid md:grid-cols-[1fr_1.4fr] md:gap-10"
              >
                <dt className="text-base font-light tracking-wide text-steam">
                  {faq.q}
                </dt>
                <dd className="mt-3 text-sm font-light leading-relaxed text-steam/60 md:mt-0">
                  {faq.a}
                  {faq.email && (
                    <>
                      {" "}
                      <a
                        href={`mailto:${faq.email}`}
                        className="text-steam underline underline-offset-4 transition-colors hover:text-onsen"
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
