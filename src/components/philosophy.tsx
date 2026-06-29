import Image from "next/image";

export function Philosophy() {
  return (
    <section
      id="experience"
      className="relative flex min-h-dvh scroll-mt-24 flex-col justify-center overflow-hidden bg-ink px-6 py-40"
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
  );
}
