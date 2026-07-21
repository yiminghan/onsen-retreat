"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { AuthButton } from "~/components/auth/auth-button";
import { GoogleButton } from "~/components/auth/google-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const labelClass =
    "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
  const fieldClass =
    "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl">
        Log in
      </h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsPending(true);
          const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: `${window.location.origin}/`,
          });
          if (error) {
            if (error.status === 403) {
              toast.error(
                "Please verify your email first — we just sent you a new link.",
              );
            } else {
              toast.error(error.message ?? "Invalid email or password.");
            }
            setIsPending(false);
            return;
          }
          router.push("/");
          router.refresh();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="login-email"
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password" className={labelClass}>
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
          <Link
            href="/forgot-password"
            className="self-end text-[0.7rem] font-light text-ink/50 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <AuthButton type="submit" disabled={isPending} className="mt-4 w-full">
          {isPending ? "Logging in…" : "Log In"}
        </AuthButton>
      </form>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="font-inclusive text-[0.7rem] tracking-[0.2em] text-ink/40 uppercase">
          or
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <GoogleButton />

      <p className="text-center text-sm font-light text-ink/60">
        New here?{" "}
        <Link href="/register" className="underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}
