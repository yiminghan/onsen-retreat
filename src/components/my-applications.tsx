"use client";

import Link from "next/link";

import { authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  APPLICATION_TAG_LABELS,
  type ApplicationStatus,
  type ApplicationTag,
} from "~/lib/retreat";

/**
 * The signed-in visitor's applications across every retreat. Renders nothing
 * for signed-out visitors and for members who haven't applied to anything.
 */
export function MyApplications() {
  const { data: session } = authClient.useSession();
  const applications = api.retreat.myApplications.useQuery(undefined, {
    enabled: !!session,
  });

  if (!session || !applications.data?.length) return null;

  return (
    <section className="mt-20">
      <h2 className="font-inclusive text-[0.65rem] tracking-[0.3em] text-ink/50 uppercase">
        Your applications
      </h2>
      <ul className="mt-6 divide-y divide-ink/10 border-t border-b border-ink/10">
        {applications.data.map((application) => {
          const status = application.status as ApplicationStatus;
          return (
            <li key={application.id}>
              <Link
                href={`/retreats/${application.retreatSlug}`}
                className="flex items-center justify-between gap-4 py-4 transition hover:opacity-70"
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg tracking-tight text-ink">
                    {application.retreatName}
                  </span>
                  <span className="mt-0.5 block font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/40 uppercase">
                    {APPLICATION_TAG_LABELS[application.tag as ApplicationTag] ??
                      application.tag}{" "}
                    ·{" "}
                    {application.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
                <span
                  className={`shrink-0 border px-2 py-1 font-inclusive text-[0.6rem] tracking-[0.2em] uppercase ${APPLICATION_STATUS_CLASSES[status]}`}
                >
                  {APPLICATION_STATUS_LABELS[status] ?? application.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
