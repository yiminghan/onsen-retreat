"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { AuthButton } from "~/components/auth/auth-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasError = searchParams.get("error") !== null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const labelClass =
    "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
  const fieldClass =
    "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

  if (!token || hasError) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="font-display text-4xl leading-[1.15] tracking-tight text-ink">
          This link is invalid or has expired.
        </h2>
        <p className="mx-auto max-w-md font-light leading-relaxed text-ink/60">
          Reset links are single-use and expire after 1 hour.{" "}
          <Link href="/forgot-password" className="underline underline-offset-2">
            Request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl">
        Choose a new password
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
          const { error } = await authClient.resetPassword({
            newPassword: password,
            token,
          });
          setIsPending(false);
          if (error) {
            toast.error(
              error.message ?? "Could not reset password. The link may have expired.",
            );
            return;
          }
          toast.success("Password updated — you can log in now.");
          router.push("/login");
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-password" className={labelClass}>
            New password
          </Label>
          <Input
            id="reset-password"
            type="password"
            required
            minLength={8}
            autoFocus
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-confirm-password" className={labelClass}>
            Confirm new password
          </Label>
          <Input
            id="reset-confirm-password"
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
          {isPending ? "Saving…" : "Reset Password"}
        </AuthButton>
      </form>
    </div>
  );
}
