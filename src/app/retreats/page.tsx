import { type Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "~/components/site-header";
import { MyApplications } from "~/components/my-applications";
import {
  RETREAT_STATUS_LABELS,
  type RetreatStatus,
  formatRetreatDates,
} from "~/lib/retreat";
import { isAdminEmail } from "~/server/admin";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Retreats — Onsen Retreat",
  description:
    "Every edition of Onsen Retreat — where we went, who came, and which ones you can still apply to.",
};

const STATUS_CLASSES: Record<RetreatStatus, string> = {
  draft: "border-ink/15 text-ink/40",
  open: "border-flame/50 text-flame",
  closed: "border-ink/25 text-ink/60",
  completed: "border-night/30 text-night/70",
};

export default async function RetreatsPage() {
  const [retreats, session] = await Promise.all([
    api.retreat.list(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const isAdmin = isAdminEmail(session?.user.email);

  return (
    <div className="bg-sand text-ink relative min-h-svh">
      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 pt-44 pb-28">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-ink mt-3 text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Retreats
          </h1>
          {isAdmin && (
            <Link
              href="/admin/retreats"
              className="font-inclusive text-ink/45 hover:text-flame text-[0.6rem] tracking-[0.2em] uppercase transition"
            >
              Manage →
            </Link>
          )}
        </div>


        <section className="mt-16">
          {retreats.length === 0 ? (
            <p className="text-ink/50 font-light">
              No retreats announced yet — check back soon.
            </p>
          ) : (
            <div className="border-ink/10 bg-ink/10 grid gap-px border sm:grid-cols-2">
              {retreats.map((retreat) => {
                const status = retreat.status as RetreatStatus;
                const dates = formatRetreatDates(
                  retreat.startDate,
                  retreat.endDate,
                );
                return (
                  <Link
                    key={retreat.id}
                    href={`/retreats/${retreat.slug}`}
                    className="group bg-sand hover:bg-ink/[0.03] flex flex-col transition"
                  >
                    <span className="relative block aspect-[16/9] overflow-hidden">
                      {retreat.coverImage ? (
                        <Image
                          src={retreat.coverImage}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
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
                        className={`bg-sand font-inclusive absolute top-3 left-3 border px-2 py-1 text-[0.6rem] tracking-[0.2em] uppercase ${STATUS_CLASSES[status] ?? STATUS_CLASSES.closed}`}
                      >
                        {RETREAT_STATUS_LABELS[status] ?? retreat.status}
                      </span>
                    </span>

                    <span className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
                      <span className="block min-w-0">
                        <span className="font-display text-ink block text-2xl leading-tight tracking-tight">
                          {retreat.name}
                        </span>
                        {retreat.description && (
                          <span className="text-ink/60 mt-2 line-clamp-2 block leading-relaxed font-light">
                            {retreat.description.split("\n\n")[0]}
                          </span>
                        )}
                      </span>

                      <span className="border-ink/10 font-inclusive text-ink/55 flex items-center justify-between gap-3 border-t pt-3 text-[0.6rem] tracking-[0.15em] uppercase">
                        <span className="truncate">
                          {[dates, retreat.location]
                            .filter(Boolean)
                            .join(" · ") || "Dates to be announced"}
                        </span>
                        <span className="whitespace-nowrap">
                          {retreat.participantCount}
                          {retreat.capacity ? `/${retreat.capacity}` : ""} in
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <MyApplications />
      </main>
    </div>
  );
}
