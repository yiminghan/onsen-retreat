"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { AuthButton } from "~/components/auth/auth-button";
import { GoogleButton } from "~/components/auth/google-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
          We&apos;ve sent a verification link to <strong>{email}</strong> —
          click it to activate your account.
          <br />
          <br />
          Don&apos;t see it? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl">
        Create an account
      </h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
          }
          if (password !== confirmPassword) {
            toast.error("Passwords don't match.");
            return;
          }
          setIsPending(true);
          const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: `${window.location.origin}/`,
          });
          setIsPending(false);
          if (error) {
            toast.error(error.message ?? "Something went wrong. Please try again.");
            return;
          }
          setIsSuccess(true);
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-name" className={labelClass}>
            Name
          </Label>
          <Input
            id="register-name"
            required
            autoFocus
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-password" className={labelClass}>
            Password
          </Label>
          <Input
            id="register-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-confirm-password" className={labelClass}>
            Confirm password
          </Label>
          <Input
            id="register-confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Same password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldClass}
          />
        </div>
        <AuthButton type="submit" disabled={isPending} className="mt-4 w-full">
          {isPending ? "Creating account…" : "Create Account"}
        </AuthButton>
      </form>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="font-inclusive text-[0.7rem] tracking-[0.2em] text-ink/40 uppercase">
          or
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="text-center text-sm font-light text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
