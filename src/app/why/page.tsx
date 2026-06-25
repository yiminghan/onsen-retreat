import { type Metadata } from "next";

import { PageShell } from "~/components/page-shell";

export const metadata: Metadata = {
  title: "Why? — Onsen Retreat",
  description:
    "Why we built a one-week onsen retreat for people who just need to finish the thing.",
};

export default function WhyPage() {
  return (
    <PageShell eyebrow="Why" kanji="湯">
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

    </PageShell>
  );
}
