"use client";

import Link from "next/link";
import { toast } from "sonner";

import { AuthButton } from "~/components/auth/auth-button";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  APPLICATION_TAG_CLASSES,
  APPLICATION_TAG_LABELS,
  type ApplicationStatus,
  type ApplicationTag,
  isAcceptingApplications,
} from "~/lib/retreat";
import { api } from "~/trpc/react";

type ApplyButtonProps = {
  retreatId: number;
  slug: string;
  status: string;
  applicationsCloseAt: Date | null;
};

// No `withdrawn` blurb — a withdrawn application renders nothing at all.
const STATUS_BLURBS: Record<Exclude<ApplicationStatus, "withdrawn">, string> = {
  submitted: "We have your application. We review in batches — sit tight.",
  in_review: "We're reading through your application right now.",
  waitlisted:
    "You're on the waitlist. If a spot frees up, we'll email you first.",
  accepted: "You're in. Check your email for logistics — see you there.",
  rejected:
    "We couldn't fit you in this round. Please do apply to the next one.",
};

/**
 * The apply CTA shown next to the retreat title: a link to
 * /retreats/[slug]/apply while applications are open, "Application over" once
 * they aren't. Hidden while the visitor already has a live application — its
 * status renders in `RetreatApplication` further down the page.
 */
export function RetreatApplyButton({
  retreatId,
  slug,
  status,
  applicationsCloseAt,
}: ApplyButtonProps) {
  const { data: session } = authClient.useSession();
  const application = api.retreat.myApplication.useQuery(
    { retreatId },
    { enabled: !!session },
  );

  if (!isAcceptingApplications({ status, applicationsCloseAt })) {
    return (
      <p className="font-inclusive text-ink/50 text-[0.65rem] tracking-[0.3em] uppercase">
        Application over
      </p>
    );
  }

  // Wait for the lookup before deciding — otherwise a member who already
  // applied sees the apply CTA flash first.
  if (session && application.isPending) return null;

  const current = application.data;
  if (current && current.status !== "withdrawn") return null;

  return (
    <AuthButton asChild>
      <Link href={`/retreats/${slug}/apply`}>Apply now</Link>
    </AuthButton>
  );
}

/**
 * The signed-in user's application status on a retreat page, with a withdraw
 * action. Renders nothing until an application exists — the apply CTA lives in
 * `RetreatApplyButton` beside the page title.
 */
export function RetreatApplication({ retreatId }: { retreatId: number }) {
  const { data: session } = authClient.useSession();

  const utils = api.useUtils();
  const application = api.retreat.myApplication.useQuery(
    { retreatId },
    { enabled: !!session },
  );

  const withdraw = api.retreat.withdraw.useMutation({
    onSuccess: async () => {
      await utils.retreat.myApplication.invalidate({ retreatId });
      await utils.retreat.myApplications.invalidate();
      toast.success("Application withdrawn.");
    },
    onError: () => {
      toast.error("Could not withdraw. Please try again.");
    },
  });

  const current = application.data;
  const currentStatus = current?.status as ApplicationStatus | undefined;

  if (!current || !currentStatus || currentStatus === "withdrawn") return null;

  return (
    <section className="border-ink/10 mt-20 border-t pt-10">
      <h2 className="font-inclusive text-ink/50 text-[0.65rem] tracking-[0.3em] uppercase">
        Your application
      </h2>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "font-inclusive border px-2.5 py-1 text-[0.6rem] tracking-[0.2em] uppercase",
              APPLICATION_STATUS_CLASSES[currentStatus],
            )}
          >
            {APPLICATION_STATUS_LABELS[currentStatus]}
          </span>
          <span
            className={cn(
              "font-inclusive border px-2.5 py-1 text-[0.6rem] tracking-[0.2em] uppercase",
              APPLICATION_TAG_CLASSES[current.tag as ApplicationTag] ??
                APPLICATION_TAG_CLASSES.retreat,
            )}
          >
            {APPLICATION_TAG_LABELS[current.tag as ApplicationTag] ??
              current.tag}
          </span>
          <span className="font-inclusive text-ink/40 text-[0.6rem] tracking-[0.15em] uppercase">
            Applied{" "}
            {current.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <p className="text-ink/60 max-w-xl leading-relaxed font-light">
          {STATUS_BLURBS[currentStatus]}
        </p>

        {/* Backfilled contest entries have no motivation — links instead. */}
        {current.motivation && (
          <blockquote className="border-ink/15 text-ink/50 max-w-xl border-l pl-4 text-sm leading-relaxed font-light whitespace-pre-wrap">
            {current.motivation}
          </blockquote>
        )}

        {(current.projectLink ?? current.videoLink) && (
          <div className="flex flex-wrap gap-4">
            {current.projectLink && (
              <a
                href={current.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inclusive text-ink/55 hover:text-flame text-[0.6rem] tracking-[0.15em] uppercase transition"
              >
                View entry ↗
              </a>
            )}
            {current.videoLink && (
              <a
                href={current.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inclusive text-ink/55 hover:text-flame text-[0.6rem] tracking-[0.15em] uppercase transition"
              >
                Watch video ↗
              </a>
            )}
          </div>
        )}

        {currentStatus !== "rejected" && (
          <button
            type="button"
            onClick={() => withdraw.mutate({ retreatId })}
            disabled={withdraw.isPending}
            className="border-ink/30 font-inclusive text-ink/50 hover:border-ink hover:text-ink self-start border-b pb-1 text-[0.6rem] tracking-[0.2em] uppercase transition disabled:opacity-50"
          >
            {withdraw.isPending ? "Withdrawing…" : "Withdraw application"}
          </button>
        )}
      </div>
    </section>
  );
}
