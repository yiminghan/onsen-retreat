import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Onsen Retreat — An Experimental One Week Program";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (hex approximations of the oklch tokens in globals.css,
// since Satori does not support the oklch color space).
const NIGHT = "#1f1d18";
const STEAM = "#f4f2ec";
const ONSEN = "#e0a766";
const EMBER = "#c8442e";

export default async function Image() {
  const bg = await readFile(
    join(process.cwd(), "public/images/onsen-1.jpg"),
  );
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

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
          backgroundColor: NIGHT,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
        {/* Dark scrim for text legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(180deg, ${NIGHT}99 0%, ${NIGHT}cc 100%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div style={{ display: "flex", fontSize: 96, color: ONSEN }}>♨</div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 22,
              letterSpacing: 12,
              textTransform: "uppercase",
              color: EMBER,
              fontWeight: 300,
            }}
          >
            Oct 2026
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 900,
              fontSize: 76,
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: -1,
              color: STEAM,
            }}
          >
            An Experimental One Week Program
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              maxWidth: 720,
              fontSize: 28,
              lineHeight: 1.5,
              fontWeight: 300,
              color: `${STEAM}b3`,
            }}
          >
            Bring your project and lock in for one week at a remote onsen town
            with no distractions.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
