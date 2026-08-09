"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";
import { AuthButton } from "~/components/auth/auth-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const SOCIAL_FIELDS = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "@yourhandle",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    placeholder: "@yourhandle",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "your-profile",
  },
] as const;

type SocialKey = (typeof SOCIAL_FIELDS)[number]["key"];

export function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const profile = api.membership.get.useQuery(undefined, {
    enabled: !!session,
  });

  const [bio, setBio] = useState("");
  const [values, setValues] = useState<Record<SocialKey, string>>({
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  // Populate the form once the saved profile loads.
  useEffect(() => {
    if (profile.data) {
      setBio(profile.data.bio ?? "");
      setValues({
        instagram: profile.data.instagram ?? "",
        twitter: profile.data.twitter ?? "",
        linkedin: profile.data.linkedin ?? "",
      });
    }
  }, [profile.data]);

  useEffect(() => {
    if (!sessionPending && !session) router.push("/login");
  }, [sessionPending, session, router]);

  const utils = api.useUtils();
  const update = api.membership.update.useMutation({
    onSuccess: async () => {
      await utils.membership.get.invalidate();
      toast.success("Profile saved.");
    },
    onError: () => {
      toast.error("Could not save your changes. Please try again.");
    },
  });

  const labelClass =
    "text-[0.7rem] font-semibold tracking-[0.02em] text-ink/80 uppercase";
  const fieldClass =
    "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-1 text-ink placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

  if (sessionPending || !session) {
    return (
      <p className="text-center text-sm font-light text-ink/50">Loading…</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl">
          Profile
        </h1>
        <p className="text-sm font-light text-ink/60">
          {session.user.name} · {session.user.email}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          update.mutate({ bio, ...values });
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-bio" className={labelClass}>
            Bio
          </Label>
          <Textarea
            id="profile-bio"
            placeholder="A short bio — who you are, what you're working on."
            maxLength={1000}
            rows={4}
            value={bio}
            disabled={profile.isPending}
            onChange={(e) => setBio(e.target.value)}
            className={fieldClass}
          />
        </div>

        {SOCIAL_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <Label htmlFor={`profile-${field.key}`} className={labelClass}>
              {field.label}
            </Label>
            <Input
              id={`profile-${field.key}`}
              placeholder={field.placeholder}
              value={values[field.key]}
              disabled={profile.isPending}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
              className={fieldClass}
            />
          </div>
        ))}

        <AuthButton
          type="submit"
          disabled={update.isPending || profile.isPending}
          className="mt-4 w-full"
        >
          {update.isPending ? "Saving…" : "Save"}
        </AuthButton>
      </form>
    </div>
  );
}
