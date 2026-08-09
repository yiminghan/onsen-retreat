import { type Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { RetreatApplicationsAdmin } from "~/components/retreat-applications-admin";
import { SiteHeader } from "~/components/site-header";
import { isAdminEmail } from "~/server/admin";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Review applications — Onsen Retreat",
  robots: { index: false },
};

/**
 * Admin-only application review for one retreat. Signed-out visitors bounce to
 * login; signed-in non-admins get a 404 so the page doesn't advertise itself.
 * The procedures behind the panel are admin-gated server-side either way.
 */
export default async function AdminRetreatPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/login?redirect=/admin/retreats/${slug}`);
  }
  if (!isAdminEmail(session.user.email)) {
    notFound();
  }

  const retreats = await api.retreat.adminList();
  const retreat = retreats.find((r) => r.slug === slug);

  if (!retreat) notFound();

  return (
    <div className="bg-sand text-ink relative min-h-svh">
      <SiteHeader />

      <main className="relative mx-auto max-w-4xl px-6 pt-44 pb-28">
        <p className="font-inclusive text-flame text-[0.65rem] tracking-[0.3em] uppercase">
          Admin
        </p>
        <h1 className="font-display text-ink mt-3 text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          {retreat.name}
        </h1>
        <p className="text-ink/60 mt-6 max-w-xl leading-relaxed font-light">
          Review applications and decide who&apos;s in. Accepting an application
          adds the applicant to the participant roster.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin/retreats"
            className="border-ink/20 font-inclusive text-ink/60 hover:border-ink hover:text-ink border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition"
          >
            ← All retreats
          </Link>
          {retreat.status !== "draft" && (
            <Link
              href={`/retreats/${retreat.slug}`}
              className="border-ink/20 font-inclusive text-ink/60 hover:border-ink hover:text-ink border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition"
            >
              Public page ↗
            </Link>
          )}
        </div>

        <RetreatApplicationsAdmin retreatId={retreat.id} />
      </main>
    </div>
  );
}
