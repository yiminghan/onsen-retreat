"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthButton } from "~/components/auth/auth-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";
import {
  APPLICATION_TAGS,
  APPLICATION_TAG_LABELS,
  type ApplicationTag,
  isAcceptingApplications,
} from "~/lib/retreat";
import { api } from "~/trpc/react";

type Props = {
  retreatId: number;
  retreatName: string;
  slug: string;
  status: string;
  applicationsCloseAt: Date | null;
};

const labelClass =
  "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
const fieldClass =
  "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

/**
 * The application form on /retreats/[slug]/apply. Handles signed-out visitors,
 * an already-live application, and closed applications; a successful submit
 * returns to the retreat page, where the status block takes over.
 */
export function RetreatApplicationForm({
  retreatId,
  retreatName,
  slug,
  status,
  applicationsCloseAt,
}: Props) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [tag, setTag] = useState<ApplicationTag>("retreat");
  const [motivation, setMotivation] = useState("");
  const [project, setProject] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const utils = api.useUtils();
  const application = api.retreat.myApplication.useQuery(
    { retreatId },
    { enabled: !!session },
  );

  const apply = api.retreat.submit.useMutation({
    onSuccess: async () => {
      await utils.retreat.myApplication.invalidate({ retreatId });
      await utils.retreat.myApplications.invalidate();
      toast.success("Application sent.");
      router.push(`/retreats/${slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const accepting = isAcceptingApplications({ status, applicationsCloseAt });
  const current = application.data;
  const live = !!current && current.status !== "withdrawn";
  // Nothing below should render until we know whether they've already applied.
  const loading = !!session && application.isPending;

  const backLink = (
    <Link
      href={`/retreats/${slug}`}
      className="self-start border-b border-ink/30 pb-1 font-inclusive text-[0.6rem] tracking-[0.2em] text-ink/50 uppercase transition hover:border-ink hover:text-ink"
    >
      ← Back to {retreatName}
    </Link>
  );

  if (!accepting) {
    return (
      <div className="mt-10 flex flex-col items-start gap-4">
        <p className="max-w-xl font-light leading-relaxed text-ink/60">
          Applications for {retreatName} are closed.
        </p>
        {backLink}
      </div>
    );
  }

  if (loading || sessionPending) {
    return <p className="mt-10 font-light text-ink/50">Loading…</p>;
  }

  if (!session) {
    return (
      <div className="mt-10 flex flex-col items-start gap-4">
        <p className="max-w-xl font-light leading-relaxed text-ink/60">
          Log in or make an account to apply — we tie applications to your
          member profile.
        </p>
        <AuthButton asChild>
          <Link
            href={`/login?redirect=${encodeURIComponent(`/retreats/${slug}/apply`)}`}
          >
            Log in to apply
          </Link>
        </AuthButton>
      </div>
    );
  }

  if (live) {
    return (
      <div className="mt-10 flex flex-col items-start gap-4">
        <p className="max-w-xl font-light leading-relaxed text-ink/60">
          You already have an application in for {retreatName} — its status
          lives on the retreat page.
        </p>
        {backLink}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply.mutate({
          retreatId,
          tag,
          motivation,
          project,
          projectLink,
          videoLink,
          notes,
          marketingConsent,
        });
      }}
      className="mt-10 flex max-w-xl flex-col gap-4"
    >
      <p className="font-light leading-relaxed text-ink/60">
        Applying as {session.user.name} · {session.user.email}
      </p>

      <div className="flex flex-col gap-2">
        <Label className={labelClass}>What are you applying with?</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {APPLICATION_TAGS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTag(option)}
              className={cn(
                "border px-4 py-1.5 font-inclusive text-[0.6rem] tracking-[0.15em] uppercase transition",
                tag === option
                  ? "border-ink bg-ink text-sand"
                  : "border-ink/20 text-ink/50 hover:border-ink hover:text-ink",
              )}
            >
              {APPLICATION_TAG_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ra-motivation" className={labelClass}>
          Why this retreat?
        </Label>
        <Textarea
          id="ra-motivation"
          required
          rows={4}
          maxLength={2000}
          placeholder="What draws you here, and what you'd bring to the room."
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ra-project" className={labelClass}>
          What are you working on?
        </Label>
        <Textarea
          id="ra-project"
          rows={2}
          maxLength={2000}
          placeholder="Optional — a project, a link, a half-formed idea."
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className={fieldClass}
        />
      </div>

      {/* Links only make sense for an entry — a plain seat request has none. */}
      {tag !== "retreat" && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ra-project-link" className={labelClass}>
              {tag === "art" ? "Artwork link" : "Project link"}
            </Label>
            <Input
              id="ra-project-link"
              type="url"
              placeholder="https://..."
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ra-video-link" className={labelClass}>
              Video link
            </Label>
            <Input
              id="ra-video-link"
              type="url"
              required={tag === "video"}
              placeholder="https://..."
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className={fieldClass}
            />
            <p className={cn(labelClass, "text-ink/45 normal-case")}>
              {tag === "video"
                ? "Your entry — the reel or video itself."
                : "Optional — a demo video, if you have one."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className={labelClass}>
              Can we use parts of your entry as marketing material? (We will
              tag you too!)
            </Label>
            <div className="mt-1 inline-flex self-start border border-ink/20">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setMarketingConsent(option.value)}
                  className={cn(
                    "px-5 py-1.5 text-[0.7rem] font-semibold tracking-[0.15em] uppercase transition-colors",
                    marketingConsent === option.value
                      ? "bg-ink text-sand"
                      : "text-ink/50 hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="ra-notes" className={labelClass}>
          Anything else we should know?
        </Label>
        <Textarea
          id="ra-notes"
          rows={2}
          maxLength={2000}
          placeholder="Optional — dietary needs, travel constraints, timing."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={fieldClass}
        />
      </div>

      <AuthButton
        type="submit"
        disabled={apply.isPending}
        className="mt-2 self-start"
      >
        {apply.isPending ? "Sending…" : "Submit application"}
      </AuthButton>
    </form>
  );
}
