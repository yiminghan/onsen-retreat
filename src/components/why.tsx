import { PreviousStack } from "~/components/previous-stack";

export function Why() {
  return (
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
        <div className="relative flex justify-center md:justify-start">
          <PreviousStack />
        </div>
      </div>
    </section>
  );
}
