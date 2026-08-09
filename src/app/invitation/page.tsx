"use client";

/**
 * Temporary official invitation letters for the 12 Retreat 001 participants.
 * Renders 12 numbered copies of the letter; each prints on its own A4 page,
 * so one Cmd+P / Save as PDF produces a 12-page PDF (one letter per person).
 * Fields with a dashed underline (name, dates, signature) are click-to-edit
 * in the browser; the underline disappears in print.
 */

import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

// Fill names in here (or click-to-edit them in the browser before printing).
const PARTICIPANTS = [
  "Mr.Phil Huelz",
  "Ms.Gracie Li",
  `Mr.Sam "Gible" Cohen`,
  "Mr.Carson Besancon",
  "Ms.Tira Smith",
  "Mr.Jacob Ober",
  "Ms.Quynh Trang Do",
  "Mr.YiMing Han",
  "Mr.Tandin Gyeltshen Moktan",
  "Mr.Jordan K",
  "Mr.Hugo",
  "Participant Name",
];

const RETREAT_DATES = "October 4 to October 10, 2026";

const COVERED_COSTS = [
  {
    item: "Round-trip airfare",
    detail:
      "Flights to and from Japan are booked and paid for by the organizers.",
  },
  {
    item: "Accommodation",
    detail:
      "Hotel accommodation in Beppu is provided for the full duration of the retreat.",
  },
  {
    item: "Local transportation",
    detail:
      "Airport transfers and local transportation in Beppu are covered or reimbursed.",
  },
];

/** Screen-editable span; prints as plain text. */
function Editable({
  children,
  className = "",
  ...rest
}: {
  children: string;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className={`rounded-sm underline decoration-flame/50 decoration-dashed underline-offset-4 outline-none focus:bg-flame/10 print:no-underline ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}

const letterDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const pad = (n: number) => String(n).padStart(2, "0");

function Letter({
  name,
  index,
  hiddenInPrint,
  breakAfter,
  onSave,
}: {
  name: string;
  index: number;
  hiddenInPrint: boolean;
  breakAfter: boolean;
  onSave: () => void;
}) {
  return (
    <div
      data-letter={index}
      className={`${hiddenInPrint ? "print:hidden" : ""} ${breakAfter ? "break-after-page" : ""}`}
    >
      {/* Screen-only label + per-letter save */}
      <div className="mx-auto flex w-[210mm] items-center justify-between pb-2 print:hidden">
        <p className="font-inclusive text-xs tracking-[0.25em] text-sand/50 uppercase">
          Letter {pad(index + 1)} / {pad(PARTICIPANTS.length)}
        </p>
        <button
          onClick={onSave}
          className="border border-flame/60 px-3 py-1.5 font-inclusive text-[0.65rem] tracking-[0.2em] text-flame uppercase transition hover:bg-flame hover:text-night"
        >
          Save this letter as PDF
        </button>
      </div>

      {/* A4 sheet: 210 × 297 mm */}
      <main className="relative mx-auto mb-12 flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-sand px-[20mm] py-[18mm] text-ink shadow-2xl print:mb-0 print:shadow-none">
        {/* Watermark */}
        <Image
          src="/images/branding/beppu_outline.svg"
          alt=""
          width={181}
          height={209}
          aria-hidden
          className="pointer-events-none absolute -right-[20mm] top-[70mm] h-auto w-[110mm] opacity-[0.05] select-none"
        />

        {/* Letterhead */}
        <header className="flex items-start justify-between border-b border-ink/15 pb-6">
          <Image
            src="/images/branding/onsen_retreat_text.svg"
            alt="Onsen Retreat"
            width={412}
            height={115}
            className="h-auto w-[44mm]"
          />
          <div className="text-right font-inclusive text-[0.6rem] leading-relaxed tracking-[0.25em] text-ink/50 uppercase">
            <p>Retreat 001</p>
            <p>Beppu · Japan</p>
            <p>onsenretreat.com</p>
          </div>
        </header>

        {/* Letter */}
        <section className="relative mt-[10mm] font-light leading-relaxed text-ink/85">
          <p className="font-inclusive text-[3.4mm] text-ink/55">
            {letterDate}
          </p>

          <h1 className="mt-8 font-display text-[8mm] tracking-tight text-ink">
            Official Invitation — Onsen Retreat 001
          </h1>

          <p className="mt-7 text-[3.9mm]">
            Dear{" "}
            <Editable data-name className="font-medium text-ink">
              {name}
            </Editable>
            ,
          </p>

          <p className="mt-5 max-w-[160mm] text-[3.9mm]">
            On behalf of Onsen Retreat, it is our pleasure to formally confirm
            your selection and participation in{" "}
            <span className="font-medium text-ink">Onsen Retreat 001</span>, an
            immersive one-week creative retreat taking place from{" "}
            <Editable className="font-medium text-ink">
              {RETREAT_DATES}
            </Editable>{" "}
            in <span className="font-medium text-ink">Beppu, Ōita, Japan</span>.
            You were selected as one of 12 participants following our
            community contests, and your place at the retreat is confirmed.
          </p>

          <p className="mt-5 max-w-[160mm] text-[3.9mm]">
            The following costs associated with your participation are covered
            or reimbursed by the organizers:
          </p>

          <ul className="mt-5 space-y-3.5">
            {COVERED_COSTS.map((cost) => (
              <li key={cost.item} className="flex max-w-[160mm] gap-4">
                <span className="mt-[1.2mm] inline-block size-[2mm] shrink-0 bg-flame" />
                <p className="text-[3.9mm]">
                  <span className="font-medium text-ink">{cost.item}.</span>{" "}
                  {cost.detail}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-[160mm] text-[3.9mm]">
            Any costs not listed above — including travel insurance, meals
            outside the retreat program, and personal expenses — remain the
            responsibility of the participant. Please retain this letter for
            your records. For any questions regarding your participation,
            contact us via WhatsApp.
          </p>

          <p className="mt-7 text-[3.9mm]">
            We look forward to welcoming you to Beppu.
          </p>

          {/* Signature */}
          <div className="mt-10">
            <p className="mt-8 font-display text-[6mm] tracking-tight text-ink">
              <Editable>YiMing Han</Editable>
            </p>
            <p className="mt-1 font-inclusive text-[3.2mm] text-ink/60">
              <Editable>Organizer, Onsen Retreat</Editable>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto flex items-end justify-between border-t border-ink/15 pt-5">
          <p className="font-inclusive text-[0.6rem] tracking-[0.2em] text-ink/45 uppercase">
            Onsen Retreat 001 · Invitation {pad(index + 1)}/
            {pad(PARTICIPANTS.length)}
          </p>
          <p className="font-inclusive text-[0.6rem] tracking-[0.2em] text-ink/45 uppercase">
            October 2026 · Beppu, Japan
          </p>
        </footer>
      </main>
    </div>
  );
}

/** Suggested-filename characters browsers reject on save. */
const cleanFilename = (s: string) => s.replace(/[/\\:*?"<>|]/g, "").trim();

export default function InvitationLetterPage() {
  // Index of the letter being printed alone; null = print all 12.
  const [printIndex, setPrintIndex] = useState<number | null>(null);

  // Dev-only page: 404 in production builds.
  if (process.env.NODE_ENV !== "development") notFound();

  // The browser's save dialog suggests document.title as the filename, so we
  // retitle right before printing ("Onsen Retreat 2026-[Name]") and restore
  // after. Printing happens in an effect so the print:hidden classes from
  // printIndex are committed to the DOM before the dialog snapshots the page.
  useEffect(() => {
    if (printIndex === null) return;
    const previousTitle = document.title;
    const name =
      document
        .querySelector(`[data-letter="${printIndex}"] [data-name]`)
        ?.textContent?.trim() ?? "Participant";
    document.title = `Onsen Retreat 2026-${cleanFilename(name)}`;
    window.print();
    document.title = previousTitle;
    setPrintIndex(null);
  }, [printIndex]);

  const printAll = () => {
    const previousTitle = document.title;
    document.title = "Onsen Retreat 2026-Invitations";
    window.print();
    document.title = previousTitle;
  };

  return (
    <div className="min-h-svh bg-night print:bg-sand">
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { background: #eeede3 !important; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="flex items-center justify-center gap-4 px-6 py-6 print:hidden">
        <p className="font-inclusive text-sm text-sand/60">
          12 letters — click any{" "}
          <span className="underline decoration-flame/60 decoration-dashed underline-offset-4">
            dashed
          </span>{" "}
          text to edit names, then save each letter as its own PDF.
        </p>
        <button
          onClick={printAll}
          className="border border-flame px-4 py-2 font-inclusive text-xs tracking-[0.2em] text-flame uppercase transition hover:bg-flame hover:text-night"
        >
          Save all 12 as one PDF
        </button>
      </div>

      {PARTICIPANTS.map((name, i) => (
        <Letter
          key={i}
          name={name}
          index={i}
          hiddenInPrint={printIndex !== null && printIndex !== i}
          breakAfter={
            printIndex === null
              ? i < PARTICIPANTS.length - 1
              : printIndex === i
                ? false
                : i < PARTICIPANTS.length - 1
          }
          onSave={() => setPrintIndex(i)}
        />
      ))}
    </div>
  );
}
