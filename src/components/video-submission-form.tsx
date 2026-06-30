"use client";

import { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function VideoSubmissionForm() {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const submit = api.videoSubmission.submit.useMutation({
    onSuccess: () => {
      setHandle("");
      setEmail("");
      setSubmissionLink("");
      setName("");
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
          Entry received.
        </h2>
        <p className="mx-auto max-w-md font-light leading-relaxed text-ink/60">
          We&apos;ve logged your submission and sent a confirmation email your
          way — check your inbox (and spam folder).
          <br />
          <br />
          Don&apos;t forget to keep your reel public and tagged{" "}
          <a
            href="https://instagram.com/onsenretreat"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @onsenretreat
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
        Video Contest
      </h1>
      <p className="mt-6 font-light leading-relaxed text-ink/60">
        For the full rules, see the{" "}
        <a href="/rules#video-contest" className="underline">
          contest details
        </a>
        .
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate({ handle, email, submissionLink, name, notes });
        }}
        className="mt-12 flex flex-col gap-4"
      >
      <div className="flex flex-col gap-2">
        <Label htmlFor="vs-handle" className={labelClass}>
          Instagram handle
        </Label>
        <Input
          id="vs-handle"
          required
          autoFocus
          placeholder="@yourhandle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className={fieldClass}
        />
        <p className={cn(labelClass, "normal-case text-ink/45")}>
          The IG account you posted from — one entry per handle.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="vs-link" className={labelClass}>
          Submission link
        </Label>
        <Input
          id="vs-link"
          type="url"
          required
          placeholder="https://instagram.com/reel/..."
          value={submissionLink}
          onChange={(e) => setSubmissionLink(e.target.value)}
          className={fieldClass}
        />
        <p className={cn(labelClass, "normal-case text-ink/45")}>
          A public link to your reel / post.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="vs-email" className={labelClass}>
          Email
        </Label>
        <Input
          id="vs-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        <p className={cn(labelClass, "normal-case text-ink/45")}>
          So we can reach you if you win.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="vs-notes" className={labelClass}>
          Anything else we should know?
        </Label>
        <Textarea
          id="vs-notes"
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
