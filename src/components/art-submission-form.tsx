"use client";

import { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function ArtSubmissionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [notes, setNotes] = useState("");

  const submit = api.artSubmission.submit.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setHandle("");
      setProjectLink("");
      setMarketingConsent(false);
      setNotes("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const labelClass =
    "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
  const fieldClass =
    "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";
  const textareaClass = cn(fieldClass, "min-h-0 resize-none");

  if (submit.isSuccess) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-light text-2xl tracking-tight text-ink">
          Submission received.
        </h2>
        <p className="mx-auto max-w-md font-light leading-relaxed text-ink/60">
          We&apos;ve logged your artwork and sent a confirmation email your way
          — check your inbox (and spam folder). We&apos;ll be in touch with any
          next steps.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
        Art / Design Submission
      </h1>
      <p className="mt-6 font-light leading-relaxed text-ink/60">
        Submit your art or design entry below. We&apos;ll follow up by email.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate({
            name,
            email,
            handle,
            projectLink,
            marketingConsent,
            notes,
          });
        }}
        className="mt-12 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="as-name" className={labelClass}>
            Name
          </Label>
          <Input
            id="as-name"
            required
            autoFocus
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="as-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="as-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <p className={cn(labelClass, "normal-case text-ink/45")}>
            So we can reach you about your submission.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="as-handle" className={labelClass}>
            Instagram handle
          </Label>
          <Input
            id="as-handle"
            required
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="as-link" className={labelClass}>
            Artwork link
          </Label>
          <Input
            id="as-link"
            type="url"
            required
            placeholder="https://..."
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            className={fieldClass}
          />
          <p className={cn(labelClass, "normal-case text-ink/45")}>
            A link to your art post on Instagram.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className={labelClass}>
            Can we use parts of your art as marketing material? (We will tag you too!)
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="as-notes" className={labelClass}>
            Anything else we should know?
          </Label>
          <Textarea
            id="as-notes"
            rows={1}
            placeholder="Optional"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={textareaClass}
          />
        </div>
        <button
          type="submit"
          disabled={submit.isPending}
          className="mt-4 self-center border-b border-ink/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ink/80 uppercase transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {submit.isPending ? "Submitting…" : "Submit Entry >"}
        </button>
      </form>
    </>
  );
}
