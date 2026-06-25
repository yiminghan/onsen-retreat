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
    q: "Who is this for?",
    a: "Builders, writers, founders — anyone with one meaningful project and no quiet stretch of time to finish it. You bring the work; we remove everything else.",
  },
  {
    q: "How long is the program?",
    a: "One week, start to finish. You arrive on a Sunday evening and leave the following Sunday morning, with seven uninterrupted days in between.",
  },
  {
    q: "Where does it take place?",
    a: "A remote onsen town in the mountains of Japan. Hot springs, cedar forest, and not much else — the isolation is the point.",
  },
  {
    q: "What's included?",
    a: "Your room, all meals, and unlimited access to the baths. We handle every logistic so the only decision you make each day is what to work on.",
  },
  {
    q: "What about Wi-Fi and phones?",
    a: "There's reliable Wi-Fi for your project. We simply ask that screens go away after dark, and we make that easy to keep.",
  },
  {
    q: "How do I join?",
    a: "We're opening soon with a small first cohort. Leave your email and you'll be the first to know when dates and pricing are announced.",
  },
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
            We want to create a once-in-a-life experience for young creatives, technologists, and academics to explore their own interest free of distractions
          </p>
          <br />
          <p className="text-2xl font-extralight leading-[1.5] tracking-tight text-steam/90 sm:text-3xl md:text-2xl">
            We want to create a once-in-a-life experience for young creatives, technologists, and academics to explore their own interest free of distractions
          </p>

        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-onsen/10 px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="mb-6 text-[0.7rem] font-light tracking-[0.45em] text-onsen uppercase">
              Questions
            </p>
            <h2 className="text-3xl font-extralight leading-[1.15] tracking-tight text-steam sm:text-4xl">
              Before you
              <br />
              ask.
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
