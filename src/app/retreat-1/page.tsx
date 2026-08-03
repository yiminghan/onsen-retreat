import fs from "node:fs";
import path from "node:path";
import { type Metadata } from "next";
import Image from "next/image";
import { eq } from "drizzle-orm";

import { SiteHeader } from "~/components/site-header";
import { db } from "~/server/db";
import {
  artSubmissions,
  hackathonSubmissions,
  videoSubmissions,
} from "~/server/db/schema";

export const metadata: Metadata = {
  title: "Retreat 001 — Onsen Retreat",
  description:
    "The people of Onsen Retreat 001 — hackathon builds, videos, and art from the community. Come say hi.",
};

// Submissions are closed; entries only change when we moderate, so refresh hourly.
export const revalidate = 3600;

type EntryType = "hackathon" | "video" | "art";

type Entry = {
  id: number;
  type: EntryType;
  name: string | null;
  handle: string;
  link: string;
  /** Separate demo video (hackathon entries) — where the thumbnail points. */
  videoLink: string | null;
  createdAt: Date;
};

const BADGES: Record<EntryType, { label: string; className: string }> = {
  hackathon: { label: "Hackathon", className: "border-flame/40 text-flame" },
  video: { label: "Video", className: "border-ink/25 text-ink/70" },
  art: { label: "Art", className: "border-night/30 text-night/80" },
};

// Some stored handles carry extra text ("handle1 , handle2", "handle (personal
// account)") — pull out the first thing that looks like an IG username.
const igHandle = (handle: string) =>
  /[A-Za-z0-9._]+/.exec(handle)?.[0] ?? handle;

/**
 * Thumbnails are static snapshots in public/retreat-1/, captured once from the
 * Instagram/YouTube embeds (submissions are closed). Entries without one — a
 * removed post, or a profile-only link — fall back to a placeholder tile.
 */
const mediaFor = (type: EntryType, id: number) => {
  const file = `${type}-${id}.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", "retreat-1", file))
    ? `/retreat-1/${file}`
    : null;
};

async function getEntries(): Promise<Entry[]> {
  const [hackathon, video, art] = await Promise.all([
    db
      .select({
        id: hackathonSubmissions.id,
        name: hackathonSubmissions.name,
        handle: hackathonSubmissions.handle,
        link: hackathonSubmissions.projectLink,
        videoLink: hackathonSubmissions.videoLink,
        createdAt: hackathonSubmissions.createdAt,
      })
      .from(hackathonSubmissions)
      .where(eq(hackathonSubmissions.marketingConsent, true)),
    // Video entries are public Instagram reels, so there was no consent
    // checkbox on that form — every entry is shown. The `rejected` flag on
    // these tables tracks contest results (rejection emails), not moderation,
    // so it doesn't filter this page.
    db
      .select({
        id: videoSubmissions.id,
        name: videoSubmissions.name,
        handle: videoSubmissions.handle,
        link: videoSubmissions.submissionLink,
        createdAt: videoSubmissions.createdAt,
      })
      .from(videoSubmissions),
    db
      .select({
        id: artSubmissions.id,
        name: artSubmissions.name,
        handle: artSubmissions.handle,
        link: artSubmissions.projectLink,
        createdAt: artSubmissions.createdAt,
      })
      .from(artSubmissions)
      .where(eq(artSubmissions.marketingConsent, true)),
  ]);

  return [
    ...hackathon.map((row) => ({ ...row, type: "hackathon" as const })),
    ...video.map((row) => ({ ...row, type: "video" as const, videoLink: null })),
    ...art.map((row) => ({ ...row, type: "art" as const, videoLink: null })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export default async function RetreatOnePage() {
  const entries = await getEntries();

  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 pt-44 pb-28">
        <p className="font-inclusive text-[0.65rem] tracking-[0.3em] text-flame uppercase">
          The People
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Retreat 001
        </h1>
        <p className="mt-6 max-w-xl font-light leading-relaxed text-ink/60">
          Everyone who built, filmed, and made their way in — hackathon
          projects, videos, and art from the community. Go say hi.
        </p>

        <section className="mt-16">
          {entries.length === 0 ? (
            <p className="font-light text-ink/50">
              Nothing to show yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
              {entries.map((entry) => {
                const badge = BADGES[entry.type];
                const handle = igHandle(entry.handle);
                // Video entries have no name field — fall back to the handle.
                const title = entry.name?.trim() ?? "";
                const media = mediaFor(entry.type, entry.id);
                const detailsLink = entry.videoLink ?? entry.link;
                return (
                  <article
                    key={`${entry.type}-${entry.id}`}
                    className="group flex flex-col bg-sand transition hover:bg-ink/[0.03]"
                  >
                    <a
                      href={detailsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-square overflow-hidden"
                    >
                      {media ? (
                        <Image
                          src={media}
                          alt={`${title || handle} — ${badge.label} entry`}
                          fill
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center bg-ink/[0.02]">
                          <Image
                            src="/onsen-asterisk.svg"
                            alt=""
                            width={56}
                            height={56}
                            className="opacity-15 transition duration-300 group-hover:rotate-45"
                          />
                        </span>
                      )}
                      <span
                        className={`absolute top-3 left-3 border bg-sand px-2 py-1 font-inclusive text-[0.6rem] tracking-[0.2em] uppercase ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </a>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
                      <div className="min-w-0">
                        <h2 className="truncate font-display text-lg leading-tight tracking-tight text-ink sm:text-xl">
                          {title || handle}
                        </h2>
                        <p className="mt-1 truncate font-inclusive text-xs text-ink/50 sm:text-sm">
                          @{handle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-ink/10 pt-3">
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-inclusive text-[0.6rem] tracking-[0.15em] whitespace-nowrap text-ink/55 uppercase transition hover:text-ink"
                        >
                          View entry ↗
                        </a>
                        <a
                          href={`https://instagram.com/${handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-flame/50 px-2 py-1 font-inclusive text-[0.6rem] tracking-[0.15em] whitespace-nowrap text-flame uppercase transition hover:bg-flame hover:text-sand"
                        >
                          Say hi →
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
