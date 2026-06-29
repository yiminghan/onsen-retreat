"use client";

import { useState } from "react";

type Swatch = { name: string; className: string; hex: string };

const COLOURS: Swatch[] = [
  { name: "Sand", className: "bg-sand", hex: "#EEEDE3" },
  { name: "Ink", className: "bg-ink", hex: "#0F0F0F" },
  { name: "Flame", className: "bg-flame", hex: "#FF7100" },
];

export function ColourSwatches() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1500);
    } catch {
      // ignore — clipboard may be unavailable in insecure contexts
    }
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-3">
      {COLOURS.map((c) => (
        <button
          key={c.name}
          type="button"
          onClick={() => copy(c.hex)}
          aria-label={`Copy ${c.hex}`}
          title={`Copy ${c.hex}`}
          className="flex cursor-pointer flex-col bg-sand text-left transition-opacity hover:opacity-80"
        >
          <div
            className={`${c.className} aspect-square w-full border-b border-ink/10`}
          />
          <div className="flex flex-col px-4 py-3">
            <span className="font-inclusive text-sm font-bold text-ink">
              {c.name}
            </span>
            <span className="font-inclusive text-[0.7rem] tracking-wide text-ink/50 uppercase">
              {copied === c.hex ? "Copied!" : c.hex}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
