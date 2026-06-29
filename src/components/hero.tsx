"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "~/components/site-header";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/**
 * Hero with a scroll-scrubbed transition: as the user scrolls through a tall
 * pinned track, the asterisk from the wordmark balloons out of its printed
 * position and wipes the viewport to black before releasing into the next
 * section. Honors prefers-reduced-motion by falling back to a static hero.
 */
export function Hero() {
  const trackRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => setReduced(mq.matches);
    applyReduced();
    mq.addEventListener("change", applyReduced);
    return () => mq.removeEventListener("change", applyReduced);
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(0);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total > 0 ? clamp(-rect.top / total) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // Animation progress finishes a touch before the track ends, holding a beat of
  // full black before the pin releases into the section below.
  const ap = reduced ? 0 : clamp(progress / 0.95);
  const scale = 1 + 39 * ap * ap; // ease-in: slow start, late burst (max ~220x)
  const textOpacity = Math.max(0, 1 - ap * 1.5);
  // The asterisk's star gaps mean it can't fill the viewport on its own, so the
  // black seal fades in alongside the expansion to complete the wipe — reaching
  // full black by ap ≈ 0.9, well before the asterisk plateaus.
  const sealOpacity = clamp((ap - 0.5) / 0.4);

  return (
    <section
      ref={trackRef}
      className={reduced ? "relative" : "relative h-[260vh]"}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 flex h-screen min-h-screen w-full flex-col overflow-hidden bg-sand">
        <div style={{ opacity: textOpacity }}>
          <SiteHeader />
        </div>

        <Image
          src="/images/branding/beppu_outline.svg"
          alt=""
          width={181}
          height={209}
          aria-hidden
          style={{ opacity: 0.4 * textOpacity }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-auto w-[40vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 select-none"
        />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex w-full max-w-[1100px] flex-col items-center">
            {/* Anchor box: the asterisk sits as a superscript to the right of
                "ONSEN" (reading "ONSEN*") and expands out of that spot. */}
            <div className="relative w-[64vw] max-w-[620px]">
              <Image
                src="/images/branding/onsen_retreat_text.svg"
                alt="Onsen Retreat"
                width={412}
                height={115}
                priority
                style={{ opacity: textOpacity }}
                className="animate-in fade-in slide-in-from-bottom-4 h-auto w-full duration-1000"
              />
              {!reduced && (
                // eslint-disable-next-line @next/next/no-img-element -- size-animated SVG overlay; driving the rendered width (not CSS scale) keeps the vector crisp, and next/image's wrapper fights the animation
                <img
                  src="/onsen-asterisk.svg"
                  alt=""
                  aria-hidden
                  style={{
                    width: `calc(min(5vw, 52px) * ${scale})`,
                    transform: "translate(-50%, -50%)",
                    transformOrigin: "center",
                    willChange: "width",
                  }}
                  className="pointer-events-none absolute top-[8%] left-[103%] z-20 h-auto select-none"
                />
              )}
            </div>

            <Link
              href="/signup"
              style={{ opacity: textOpacity }}
              className="group animate-in fade-in slide-in-from-bottom-3 mt-10 inline-flex items-center gap-2 font-inclusive text-lg font-bold tracking-wide text-ink uppercase underline underline-offset-8 decoration-1 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:decoration-2 hover:underline-offset-[10px] sm:text-xl"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div
          style={{ opacity: textOpacity }}
          className="animate-in fade-in slide-in-from-bottom-5 pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-baseline justify-between px-6 pb-8 font-inclusive text-lg text-ink duration-1000 sm:px-10 sm:pb-10 sm:text-[32px]"
        >
          <p>
            <span className="font-bold">Beppu</span> Japan
          </p>
          <p>
            <span className="font-bold">2026</span> Oct
          </p>
        </div>

        {/* Final seal: guarantees a fully black viewport at the end of the wipe,
            above the (faded) header, regardless of the asterisk's exact reach. */}
        {!reduced && (
          <div
            aria-hidden
            style={{ opacity: sealOpacity }}
            className="pointer-events-none absolute inset-0 z-40 bg-ink"
          />
        )}
      </div>
    </section>
  );
}
