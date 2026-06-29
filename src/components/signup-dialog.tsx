"use client";

import { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function SignupDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
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
    "text-[0.7rem] font-light tracking-[0.3em] text-steam/70 uppercase";
  const fieldClass =
    "border-steam/15 bg-steam/[0.03] text-steam placeholder:text-steam/30 focus-visible:border-steam/60 focus-visible:ring-steam/20";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) join.reset();
        setOpen(o);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-none bg-night text-steam ring-1 ring-steam/15 sm:max-w-md">
        {join.isSuccess ? (
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-tight text-steam">
              You&apos;re on the list.
            </DialogTitle>
            <DialogDescription className="font-light leading-relaxed text-steam/60">
              We&apos;ve sent a confirmation email your way — please check your
              inbox to confirm your spot.
              <br />
              <br />
              Don&apos;t see it? Check your spam folder (and mark it &ldquo;not
              spam&rdquo; so you don&apos;t miss what comes next).
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight text-steam">
            Sign up
          </DialogTitle>
          <DialogDescription className="font-light leading-relaxed text-steam/60">
            Our first cohort runs Oct 2026. Tell us a little about yourself!
            <br />
            The more people who sign up, the more chances we have at securing bigger sponsorships and providing a better experience!
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            join.mutate({ name, email, handle, school, project, notes });
          }}
          className="flex flex-col gap-4 pt-2"
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
            <p className="text-md font-light tracking-wide text-steam/40">
              {"If you are not a student, just put your job.  Non-students are very welcome too :)"}
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
              className={fieldClass}
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
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={join.isPending}
            className="mt-4 self-center border-b border-steam/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-steam/80 uppercase transition-colors hover:border-steam hover:text-steam disabled:opacity-50"
          >
            {join.isPending ? "Signing up…" : "Sign Up"}
          </button>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
