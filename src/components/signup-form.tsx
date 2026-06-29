"use client";

import { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [school, setSchool] = useState("");
  const [project, setProject] = useState("");
  const [notes, setNotes] = useState("");

  const join = api.waitlist.join.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setHandle("");
      setSchool("");
      setProject("");
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
  const textareaClass = `${fieldClass} min-h-10 resize-none`;

  if (join.isSuccess) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="font-light text-2xl tracking-tight text-ink">
          You&apos;re on the list.
        </h2>
        <p className="mx-auto max-w-md font-light leading-relaxed text-ink/60">
          We&apos;ve sent a confirmation email your way — please check your
          inbox to confirm your spot.
          <br />
          <br />
          Don&apos;t see it? Check your spam folder (and mark it &ldquo;not
          spam&rdquo; so you don&apos;t miss what comes next).
          <br />
          <br />
          Also — don&apos;t forget to join our <a href="https://discord.com/invite/fhqu7GY42" className="underline" target="_blank" rel="noopener noreferrer">&gt;discord&lt;</a>.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-ink/15 pb-12 text-center">
        <p className="text-[0.7rem] font-light tracking-[0.45em] text-ink uppercase">
          Sign up
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          join.mutate({ name, email, handle, school, project, notes });
        }}
        className="mt-12 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-name" className={labelClass}>
            Name
          </Label>
          <Input
            id="signup-name"
            required
            autoFocus
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-handle" className={labelClass}>
            Handle
          </Label>
          <Input
            id="signup-handle"
            placeholder="Your IG / TikTok handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-school" className={labelClass}>
            School
          </Label>
          <Input
            id="signup-school"
            placeholder="Ideally we want to bring together folks from different countries!"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className={fieldClass}
          />
          <p className="text-md font-light tracking-wide text-ink/40">
            Not a student? Just put your job — non-students are very welcome
            too :)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-project" className={labelClass}>
            Project you&apos;re working on
          </Label>
          <Textarea
            id="signup-project"
            required
            placeholder="What are you going to be working on for the one week program?"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className={textareaClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-notes" className={labelClass}>
            Anything else we should know?
          </Label>
          <Textarea
            id="signup-notes"
            placeholder="Optional"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={textareaClass}
          />
        </div>
        <button
          type="submit"
          disabled={join.isPending}
          className="mt-4 self-center border-b border-ink/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ink/80 uppercase transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {join.isPending ? "Signing up…" : "Sign Up"}
        </button>
      </form>
    </>
  );
}
