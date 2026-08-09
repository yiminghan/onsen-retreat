import fs from "node:fs";
import path from "node:path";
import { type Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import {
  RetreatApplication,
  RetreatApplyButton,
} from "~/components/retreat-application";
import { SiteHeader } from "~/components/site-header";
import {
  APPLICATION_TAG_CLASSES,
  APPLICATION_TAG_LABELS,
  type ApplicationTag,
  type RetreatStatus,
  formatRetreatDates,
} from "~/lib/retreat";
import { api } from "~/trpc/server";

type Props = { params: Promise<{ slug: string }> };

async function getRetreat(slug: string) {
  try {
    return await api.retreat.getBySlug({ slug });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRetreat(slug);

  if (!data) return { title: "Retreat — Onsen Retreat" };

  return {
    title: `${data.retreat.name} — Onsen Retreat`,
    description:
      data.retreat.description?.slice(0, 200) ?? "An edition of Onsen Retreat.",
  };
}

// Some stored handles carry extra text ("handle1 , handle2", "handle (personal
// account)") — pull out the first thing that looks like an IG username.
const igHandle = (handle: string) =>
  /[A-Za-z0-9._]+/.exec(handle)?.[0] ?? handle;

/**
 * Thumbnails are the static snapshots captured for /retreat-1, keyed by the
 * legacy table an entry was backfilled from. Applications made through the
 * retreat form have no snapshot and fall back to a placeholder tile.
 */
const mediaFor = (sourceTable: string | null, sourceId: number | null) => {
  if (!sourceTable || sourceId === null) return null;
  const file = `${sourceTable.replace(/_submission$/, "")}-${sourceId}.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", "retreat-1", file))
    ? `/retreat-1/${file}`
    : null;
};

const SOCIALS = [
  {
    key: "instagram",
    label: "IG",
    url: (h: string) => `https://instagram.com/${h}`,
  },
  { key: "twitter", label: "X", url: (h: string) => `https://x.com/${h}` },
  {
    key: "linkedin",
    label: "IN",
    url: (h: string) => `https://linkedin.com/in/${h}`,
  },
] as const;

export default async function RetreatPage({ params }: Props) {
  const { slug } = await params;
  const data = await getRetreat(slug);

  if (!data) notFound();

  const { retreat, applications } = data;
  const dates = formatRetreatDates(retreat.startDate, retreat.endDate);

  return (
    <div className="bg-sand text-ink relative min-h-svh">
      <SiteHeader />

      <main className="relative mx-auto max-w-4xl px-6 pt-44 pb-28">
        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-5 w-full justify-between">

          <h1 className="font-display text-ink text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            {retreat.name}
          </h1>
          <RetreatApplyButton
            retreatId={retreat.id}
            slug={slug}
            status={retreat.status}
            applicationsCloseAt={retreat.applicationsCloseAt}
          />
        </div>
        {retreat.description && (
          <section className="mt-4 max-w-full">
            {retreat.description.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-ink/70 mt-4 leading-relaxed font-light first:mt-0"
              >
                {paragraph}
              </p>
            ))}
          </section>
        )}
        <dl className="border-ink/10 bg-ink/10 mt-12 grid grid-cols-2 gap-px border sm:grid-cols-4">
          {[
            { label: "Dates", value: dates ?? "TBA" },
            { label: "Where", value: retreat.location ?? "TBA" },
            {
              label: "Spots",
              value: retreat.capacity ? `${retreat.capacity}` : "Open",
            },
          ].map((item) => (
            <div key={item.label} className="bg-sand p-4 sm:p-5">
              <dt className="font-inclusive text-ink/40 text-[0.6rem] tracking-[0.2em] uppercase">
                {item.label}
              </dt>
              <dd className="font-inclusive text-ink mt-2 text-lg tracking-tight">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>



        <RetreatApplication retreatId={retreat.id} />

        {applications.length > 0 && (
          <section className="mt-12">
            <h2 className="font-inclusive text-ink/50 text-[0.65rem] tracking-[0.3em] uppercase">
              Applications
            </h2>

            <div className="border-ink/10 bg-ink/10 mt-6 grid grid-cols-2 gap-px border sm:grid-cols-3">
              {applications.map((application) => {
                const tag = application.tag as ApplicationTag;
                const tagLabel = APPLICATION_TAG_LABELS[tag] ?? application.tag;
                const handle = application.handle
                  ? igHandle(application.handle)
                  : null;
                const media = mediaFor(
                  application.sourceTable,
                  application.sourceId,
                );
                const entryLink =
                  application.projectLink ?? application.videoLink;
                // A hackathon entry's thumbnail points at its demo video.
                const detailsLink =
                  application.videoLink ?? application.projectLink;
                const tile = (
                  <>
                    {media ? (
                      <Image
                        src={media}
                        alt={`${application.name} — ${tagLabel} entry`}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="bg-ink/[0.02] flex h-full items-center justify-center">
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
                      className={`bg-sand font-inclusive absolute top-3 left-3 border px-2 py-1 text-[0.6rem] tracking-[0.2em] uppercase ${APPLICATION_TAG_CLASSES[tag] ??
                        APPLICATION_TAG_CLASSES.retreat
                        }`}
                    >
                      {tagLabel}
                    </span>
                  </>
                );
                return (
                  <article
                    key={application.id}
                    className="group bg-sand hover:bg-ink/[0.03] flex flex-col transition"
                  >
                    {detailsLink ? (
                      <a
                        href={detailsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-square overflow-hidden"
                      >
                        {tile}
                      </a>
                    ) : (
                      <div className="relative aspect-square overflow-hidden">
                        {tile}
                      </div>
                    )}

                    <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
                      <div className="min-w-0">
                        <h3 className="font-display text-ink truncate text-lg leading-tight tracking-tight sm:text-xl">
                          {application.name}
                        </h3>
                        {handle && (
                          <p className="font-inclusive text-ink/50 mt-1 truncate text-xs sm:text-sm">
                            @{handle}
                          </p>
                        )}
                      </div>

                      {(entryLink ?? handle) && (
                        <div className="border-ink/10 flex items-center justify-between gap-2 border-t pt-3">
                          {entryLink && (
                            <a
                              href={entryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-inclusive text-ink/55 hover:text-ink text-[0.6rem] tracking-[0.15em] whitespace-nowrap uppercase transition"
                            >
                              View entry ↗
                            </a>
                          )}
                          {handle && (
                            <a
                              href={`https://instagram.com/${handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-flame/50 font-inclusive text-flame hover:bg-flame hover:text-sand ml-auto border px-2 py-1 text-[0.6rem] tracking-[0.15em] whitespace-nowrap uppercase transition"
                            >
                              Say hi →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
