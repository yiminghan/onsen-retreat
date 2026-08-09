import { type Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { RetreatsAdmin } from "~/components/retreats-admin";
import { SiteHeader } from "~/components/site-header";
import { isAdminEmail } from "~/server/admin";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Manage retreats — Onsen Retreat",
  robots: { index: false },
};

/**
 * Admin-only editor for retreats. Signed-out visitors bounce to login;
 * signed-in non-admins get a 404 so the page doesn't advertise itself. The
 * procedures behind the editor are admin-gated server-side either way.
 */
export default async function AdminRetreatsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login?redirect=/admin/retreats");
  }
  if (!isAdminEmail(session.user.email)) {
    notFound();
  }

  return (
    <div className="bg-sand text-ink relative min-h-svh">
      <SiteHeader />

      <main className="relative mx-auto max-w-4xl px-6 pt-44 pb-28">
        <p className="font-inclusive text-flame text-[0.65rem] tracking-[0.3em] uppercase">
          Admin
        </p>
        <h1 className="font-display text-ink mt-3 text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          Manage retreats
        </h1>
        <p className="text-ink/60 mt-6 max-w-xl leading-relaxed font-light">
          Create new editions, edit the ones that exist, and delete the ones
          that shouldn&apos;t. Drafts stay hidden from the public pages.
        </p>

        <RetreatsAdmin />
      </main>
    </div>
  );
}
