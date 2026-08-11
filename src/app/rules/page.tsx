import { redirect } from "next/navigation";

/**
 * The static rules page moved to the DB-driven /retreats/[slug]/rules.
 * Sent contest emails and old links point here, so the route stays as a
 * redirect. Temporary (307) on purpose — the target changes per edition,
 * and browsers cache permanent redirects. Hash fragments (#hackathon …)
 * survive the redirect; the section ids are unchanged.
 */
export default function RulesPage() {
  redirect("/retreats/retreat-001/rules");
}
