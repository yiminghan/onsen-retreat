import { type Metadata } from "next";
import Image from "next/image";

import { SiteHeader } from "~/components/site-header";
import { ColourSwatches } from "~/components/colour-swatches";

export const metadata: Metadata = {
  title: "Brand — Onsen Retreat",
  description:
    "Logos, marks, typography, and colours for Onsen Retreat. Download the brand assets.",
};

type Mark = {
  src: string;
  label: string;
};

const MARKS: Mark[] = [
  { src: "/images/branding/brand_logo.svg", label: "Brand Logo" },
  { src: "/onsen-asterisk.svg", label: "Asterisk" },
  { src: "/asterisk-1080-black-on-white.png", label: "Asterisk — Black on White" },
  { src: "/images/branding/beppu_outline.svg", label: "Beppu Outline" },
  { src: "/images/branding/poster_2.png", label: "Poster 02" },
  { src: "/images/branding/poster_01.png", label: "Poster 01" },
  { src: "/images/branding/onsen_text.svg", label: "Onsen Text" },
  { src: "/onsen-wordmark.svg", label: "Wordmark" },
  { src: "/onsen-retreat.svg", label: "Onsen Retreat" },
  { src: "/images/branding/map.svg", label: "Map" },
  { src: "/images/branding/map_label.svg", label: "Map — Labelled" },
  { src: "/images/branding/timeline.svg", label: "Timeline" },
];

type Video = {
  src: string;
  label: string;
};

const VIDEOS: Video[] = [
  { src: "/videos/hero.MP4", label: "Hero" },
  { src: "/videos/date.MP4", label: "Date" },
  { src: "/videos/location.MP4", label: "Location" },
  { src: "/videos/out_of_offic.MP4", label: "Out of Office" },
];

type Specimen = {
  name: string;
  role: string;
  className: string;
  sample: string;
};

const FONTS: Specimen[] = [
  {
    name: "Imaginice",
    role: "Display / Titles",
    className: "font-display",
    sample: "Onsen",
  },
  {
    name: "Inclusive Sans",
    role: "Everything else",
    className: "font-inclusive",
    sample: "Retreat",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
      {children}
    </h2>
  );
}

export default function BrandPage() {
  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 pt-44 pb-28">

        {/* Logos & marks */}
        <section className="relative mt-20">
          <div className="mt-8 grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-3">
            {MARKS.map((m) => (
              <a
                key={m.src}
                href={m.src}
                download
                className={`group relative flex aspect-square flex-col items-center justify-center gap-5 p-8 transition bg-sand hover:bg-ink/[0.03]"
                  }`}
              >
                <div className="relative w-full flex-1">
                  <Image
                    src={m.src}
                    alt={m.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className={`font-inclusive text-[0.65rem] tracking-[0.2em] uppercase text-ink/55"
                    }`}
                >

                  <span className="hidden group-hover:inline">Download ↓</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Videos */}
        <section className="relative mt-24">
          <div className="mt-8 grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-3">
            {VIDEOS.map((v) => (
              <a
                key={v.src}
                href={v.src}
                download
                className="group relative flex aspect-square flex-col items-center justify-center gap-5 bg-sand p-8 transition hover:bg-ink/[0.03]"
              >
                <div className="relative flex flex-1 items-center justify-center">
                  <video
                    src={v.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="max-h-32 w-auto max-w-full object-contain"
                  />
                </div>
                <span className="font-inclusive text-[0.65rem] tracking-[0.2em] text-ink/55 uppercase">
                  <span className="hidden group-hover:inline">Download ↓</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="relative">
          <div className="grid gap-px bg-ink/10 sm:grid-cols-2">
            {FONTS.map((f) => (
              <div key={f.name} className="flex flex-col gap-6 bg-sand p-8">
                <p className={`${f.className} text-6xl leading-none text-ink`}>
                  {f.sample}
                </p>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-inclusive text-base font-bold text-ink">
                      {f.name}
                    </span>
                    <span className="font-inclusive text-[0.65rem] tracking-[0.2em] text-ink/50 uppercase">
                      {f.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Colour */}
        <section className="relative">

          <ColourSwatches />
        </section>
      </main>
    </div>
  );
}
