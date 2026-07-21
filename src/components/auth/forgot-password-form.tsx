"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { AuthButton } from "~/components/auth/auth-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const labelClass =
    "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
  const fieldClass =
    "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="font-display text-4xl leading-[1.15] tracking-tight text-ink">
          Check your inbox.
        </h2>
        <p className="mx-auto max-w-md font-light leading-relaxed text-ink/60">
          If an account exists for that email, a password reset link is on its
          way. The link expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl">
          Forgot your password?
        </h1>
        <p className="font-light text-sm leading-relaxed text-ink/60">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsPending(true);
          const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/reset-password`,
          });
          setIsPending(false);
          if (error) {
            toast.error("Something went wrong. Please try again.");
            return;
          }
          // Same copy regardless of whether the account exists.
          setIsSuccess(true);
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="forgot-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="forgot-email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
        <AuthButton type="submit" disabled={isPending} className="mt-4 w-full">
          {isPending ? "Sending…" : "Send Reset Link"}
        </AuthButton>
      </form>

      <p className="text-center text-sm font-light text-ink/60">
        Remembered it?{" "}
        <Link href="/login" className="underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
