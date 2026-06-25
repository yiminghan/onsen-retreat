import { type Metadata } from "next";

import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { PreviousStack } from "~/components/previous-stack";

export const metadata: Metadata = {
  title: "Why? — Onsen Retreat",
  description:
    "Why we built a one-week onsen retreat for people who just need to finish the thing.",
};

export default function WhyPage() {
  return (
    <div className="relative min-h-screen bg-night text-steam">
      <SiteHeader variant="solid" />

      <main className="relative mx-auto max-w-3xl px-6 pt-44 pb-28">
        <span
          className="pointer-events-none absolute top-28 right-0 -z-0 text-[16rem] leading-none text-steam/[0.03] select-none"
          aria-hidden
        >
          湯
        </span>


        <header className="relative mt-16 border-b border-onsen/15 pb-12 text-center">
          <p className="text-[0.7rem] font-light tracking-[0.45em] text-onsen uppercase">
            Why
          </p>
        </header>
        <PreviousStack />

        <div className="prose-onsen relative mt-14 space-y-7 text-lg font-light leading-relaxed tracking-wide text-steam/75">
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

      </main>

      <SiteFooter />
    </div>
  );
}
