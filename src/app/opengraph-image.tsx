import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Onsen Retreat — An Experimental One Week Program";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (hex of the oklch tokens in globals.css; Satori has no oklch).
const SAND = "#eeede3"; // --color-sand, cream background
const INK = "#0f0f0f"; // --color-ink, near-black text

const dataUri = (svg: Buffer) =>
  `data:image/svg+xml;base64,${svg.toString("base64")}`;

// A still of the hero's resting state: the wordmark over a faint Beppu outline
// on a sand field, with the Beppu/2026 footer in Inclusive Sans.
export default async function Image() {
  const brandDir = join(process.cwd(), "public/images/branding");
  const [wordmark, beppu, asterisk] = await Promise.all([
    readFile(join(brandDir, "onsen_retreat_text.svg")),
    readFile(join(brandDir, "beppu_outline.svg")),
    readFile(join(process.cwd(), "public/onsen-asterisk.svg")),
  ]);

  const fontDir = join(process.cwd(), "public/fonts/inclusive-sans");
  const [inclusive400, inclusive700] = await Promise.all([
    readFile(join(fontDir, "inclusive-sans-regular.ttf")),
    readFile(join(fontDir, "inclusive-sans-bold.ttf")),
  ]);

  // Wordmark viewBox 731×372; sized to echo the hero's max-w-[620px].
  const wordmarkW = 620;
  const wordmarkH = Math.round((wordmarkW * 372) / 731); // 316

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: SAND,
          fontFamily: "Inclusive Sans",
        }}
      >
        {/* Faint Beppu outline behind the wordmark (hero: 40vw, opacity 0.4) */}
        <img
          src={dataUri(beppu)}
          alt=""
          width={420}
          height={Math.round((420 * 209) / 181)}
          style={{ position: "absolute", opacity: 0.4 }}
        />

        {/* Wordmark with the asterisk as a superscript after "ONSEN" */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: wordmarkW,
            height: wordmarkH,
          }}
        >
          <img
            src={dataUri(wordmark)}
            alt="Onsen Retreat"
            width={wordmarkW}
            height={wordmarkH}
          />
          <img
            src={dataUri(asterisk)}
            alt=""
            width={52}
            height={52}
            style={{
              position: "absolute",
              top: "8%",
              left: "103%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Footer: "Beppu Japan" / "2026 Oct" — matches hero.tsx */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 56,
            right: 56,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            fontSize: 32,
            color: INK,
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ fontWeight: 700 }}>Beppu</span>
            <span style={{ fontWeight: 400 }}>&nbsp;Japan</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ fontWeight: 700 }}>2026</span>
            <span style={{ fontWeight: 400 }}>&nbsp;Oct</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inclusive Sans",
          data: inclusive400,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inclusive Sans",
          data: inclusive700,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
