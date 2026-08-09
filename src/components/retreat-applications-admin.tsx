"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  APPLICATION_TAG_CLASSES,
  APPLICATION_TAG_LABELS,
  type ApplicationStatus,
  type ApplicationTag,
} from "~/lib/retreat";
import { api } from "~/trpc/react";

/** Decisions a reviewer can make — `withdrawn` is the applicant's to set. */
const DECISIONS = [
  "submitted",
  "in_review",
  "waitlisted",
  "accepted",
  "rejected",
] as const;

/**
 * Reviewer panel on /admin/retreats/[slug]. Only rendered for admins (the page
 * checks the reviewer list server-side); the procedures behind it are
 * admin-gated too. Accepting an application adds the applicant to the roster.
 */
export function RetreatApplicationsAdmin({ retreatId }: { retreatId: number }) {
  const utils = api.useUtils();
  const applications = api.retreat.listApplications.useQuery({ retreatId });
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);

  const decide = api.retreat.decide.useMutation({
    onSuccess: async () => {
      await utils.retreat.listApplications.invalidate({ retreatId });
      toast.success("Decision saved.");
    },
    onError: () => toast.error("Could not save the decision."),
    onSettled: () => setPendingId(null),
  });

  return (
    <section className="mt-20 border-t border-flame/30 pt-10">
      <h2 className="font-inclusive text-[0.65rem] tracking-[0.3em] text-flame uppercase">
        Review — {applications.data?.length ?? 0} application
        {applications.data?.length === 1 ? "" : "s"}
      </h2>

      {applications.isPending ? (
        <p className="mt-6 font-light text-ink/50">Loading…</p>
      ) : !applications.data?.length ? (
        <p className="mt-6 font-light text-ink/50">Nobody has applied yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-px bg-ink/10">
          {applications.data.map((application) => {
            const status = application.status as ApplicationStatus;
            const tag = application.tag as ApplicationTag;
            const noteValue =
              notes[application.id] ?? application.reviewNotes ?? "";
            return (
              <li key={application.id} className="bg-sand p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg tracking-tight text-ink">
                      {application.applicantName}
                      {application.handle && (
                        <span className="ml-2 font-inclusive text-xs text-ink/40">
                          @{application.handle}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm font-light text-ink/50">
                      {application.applicantEmail || "no email"}
                      {/* Backfilled entries can't be added to the roster. */}
                      {!application.hasAccount && (
                        <span className="ml-2 text-ink/35">· no account</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <span
                      className={cn(
                        "border px-2 py-1 font-inclusive text-[0.6rem] tracking-[0.2em] uppercase",
                        APPLICATION_TAG_CLASSES[tag] ??
                          APPLICATION_TAG_CLASSES.retreat,
                      )}
                    >
                      {APPLICATION_TAG_LABELS[tag] ?? application.tag}
                    </span>
                    <span
                      className={cn(
                        "border px-2 py-1 font-inclusive text-[0.6rem] tracking-[0.2em] uppercase",
                        APPLICATION_STATUS_CLASSES[status],
                      )}
                    >
                      {APPLICATION_STATUS_LABELS[status] ?? application.status}
                    </span>
                  </div>
                </div>

                {application.motivation && (
                  <p className="mt-4 text-sm font-light leading-relaxed whitespace-pre-wrap text-ink/70">
                    {application.motivation}
                  </p>
                )}

                {(application.projectLink ?? application.videoLink) && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {application.projectLink && (
                      <a
                        href={application.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/55 uppercase transition hover:text-flame"
                      >
                        Entry ↗
                      </a>
                    )}
                    {application.videoLink && (
                      <a
                        href={application.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/55 uppercase transition hover:text-flame"
                      >
                        Video ↗
                      </a>
                    )}
                  </div>
                )}
                {application.project && (
                  <p className="mt-3 text-sm font-light leading-relaxed whitespace-pre-wrap text-ink/50">
                    <span className="font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/40 uppercase">
                      Project ·{" "}
                    </span>
                    {application.project}
                  </p>
                )}
                {application.notes && (
                  <p className="mt-3 text-sm font-light leading-relaxed whitespace-pre-wrap text-ink/50">
                    <span className="font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/40 uppercase">
                      Notes ·{" "}
                    </span>
                    {application.notes}
                  </p>
                )}

                {/* Which emails this entry has already been sent — carried over
                    from the contest tables so nobody gets a duplicate. */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Confirmation", sent: application.confirmationEmailSent },
                    { label: "Thank you", sent: application.thankYouEmailSent },
                    { label: "Rejection", sent: application.rejectionEmailSent },
                  ].map((email) => (
                    <span
                      key={email.label}
                      className={cn(
                        "border px-2 py-1 font-inclusive text-[0.55rem] tracking-[0.15em] uppercase",
                        email.sent
                          ? "border-ink/30 text-ink/60"
                          : "border-ink/10 text-ink/25",
                      )}
                    >
                      {email.label} {email.sent ? "sent" : "—"}
                    </span>
                  ))}
                </div>

                {application.rejectionEmailText && (
                  <p className="mt-3 border-l border-ink/15 pl-4 text-sm font-light leading-relaxed whitespace-pre-wrap text-ink/50">
                    <span className="font-inclusive text-[0.6rem] tracking-[0.15em] text-ink/40 uppercase">
                      Rejection email draft ·{" "}
                    </span>
                    {application.rejectionEmailText}
                  </p>
                )}

                <Textarea
                  aria-label={`Review notes for ${application.applicantName}`}
                  rows={1}
                  maxLength={2000}
                  placeholder="Internal review notes (never shown to the applicant)"
                  value={noteValue}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      [application.id]: e.target.value,
                    }))
                  }
                  className="mt-4 min-h-0 resize-none rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {DECISIONS.map((decision) => (
                    <button
                      key={decision}
                      type="button"
                      disabled={decide.isPending || decision === status}
                      onClick={() => {
                        setPendingId(application.id);
                        decide.mutate({
                          applicationId: application.id,
                          status: decision,
                          reviewNotes: noteValue,
                        });
                      }}
                      className={cn(
                        "border px-3 py-1.5 font-inclusive text-[0.6rem] tracking-[0.15em] uppercase transition disabled:opacity-40",
                        decision === status
                          ? "border-ink bg-ink text-sand"
                          : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink",
                      )}
                    >
                      {pendingId === application.id && decide.isPending
                        ? "…"
                        : APPLICATION_STATUS_LABELS[decision]}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
