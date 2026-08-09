import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { RetreatApplicationForm } from "~/components/retreat-application-form";
import { SiteHeader } from "~/components/site-header";
import { formatRetreatDates } from "~/lib/retreat";
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

  if (!data) return { title: "Apply — Onsen Retreat" };

  return {
    title: `Apply — ${data.retreat.name} — Onsen Retreat`,
    description: `Apply to ${data.retreat.name}.`,
  };
}

export default async function RetreatApplyPage({ params }: Props) {
  const { slug } = await params;
  const data = await getRetreat(slug);

  if (!data) notFound();

  const { retreat } = data;
  const dates = formatRetreatDates(retreat.startDate, retreat.endDate);

  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-4xl px-6 pt-44 pb-28">
        <p className="font-inclusive text-[0.65rem] tracking-[0.3em] text-flame uppercase">
          Apply
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          {retreat.name}
        </h1>
        <p className="mt-6 max-w-xl font-light leading-relaxed text-ink/60">
          {[dates, retreat.location].filter(Boolean).join(" · ") ||
            "Dates and location to be announced."}
        </p>

        <RetreatApplicationForm
          retreatId={retreat.id}
          retreatName={retreat.name}
          slug={slug}
          status={retreat.status}
          applicationsCloseAt={retreat.applicationsCloseAt}
        />
      </main>
    </div>
  );
}
