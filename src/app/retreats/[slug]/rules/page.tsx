import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { RetreatRulesGuides } from "~/components/retreat-rules-guides";
import { SiteHeader } from "~/components/site-header";
import { api } from "~/trpc/server";

type Props = { params: Promise<{ slug: string }> };

async function getRules(slug: string) {
  try {
    return await api.retreat.rules({ slug });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRules(slug);

  if (!data) return { title: "Rules — Onsen Retreat" };

  return {
    title: `Rules — ${data.retreat.name} — Onsen Retreat`,
    description: `Guides and rules for ${data.retreat.name} participants — contests, visa & travel guidance, expenses, and more.`,
  };
}

export default async function RetreatRulesPage({ params }: Props) {
  const { slug } = await params;
  const data = await getRules(slug);

  if (!data) notFound();

  const { retreat, rules } = data;

  return (
    <div className="relative min-h-svh bg-sand text-ink">
      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 pt-44 pb-28">
        <p className="font-inclusive text-[0.65rem] tracking-[0.3em] text-ink/50 uppercase">
          <Link
            href={`/retreats/${retreat.slug}`}
            className="transition-colors hover:text-ink"
          >
            {retreat.name}
          </Link>
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Rules
        </h1>

        {rules.length > 0 ? (
          <RetreatRulesGuides rules={rules} />
        ) : (
          <p className="mt-16 max-w-2xl text-lg font-light leading-relaxed tracking-wide text-ink/75">
            Rules and guides for this retreat haven&apos;t been published yet —
            check back soon.
          </p>
        )}
      </main>
    </div>
  );
}
