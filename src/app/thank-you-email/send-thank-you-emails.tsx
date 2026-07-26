"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function SendThankYouEmails() {
  const utils = api.useUtils();
  const status = api.hackathonSubmission.thankYouStatus.useQuery();

  const send = api.hackathonSubmission.sendThankYouEmails.useMutation({
    onSuccess: (result) => {
      if (result.failed.length > 0) {
        toast.error(
          `Sent ${result.sent}, but ${result.failed.length} failed: ${result.failed.join(", ")}`,
        );
      } else {
        toast.success(`Sent ${result.sent} thank-you emails.`);
      }
      void utils.hackathonSubmission.thankYouStatus.invalidate();
    },
    onError: (error) => {
      toast.error(
        error.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to send emails."
          : "Something went wrong sending emails.",
      );
    },
  });

  const pending = status.data?.pending;

  const handleClick = () => {
    if (
      !window.confirm(
        `Send the hackathon thank-you email to ${pending ?? "all"} pending submission(s)?`,
      )
    ) {
      return;
    }
    send.mutate();
  };

  return (
    <div className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
      <p className="text-sm text-white/70">
        {status.data
          ? `${status.data.pending} of ${status.data.total} submissions pending`
          : status.isError
            ? "Log in to see submission counts."
            : "Loading submissions…"}
      </p>
      <Button
        onClick={handleClick}
        disabled={send.isPending || pending === 0}
        variant="secondary"
      >
        {send.isPending
          ? "Sending…"
          : pending === 0
            ? "All sent"
            : "Send to all pending"}
      </Button>
    </div>
  );
}

export function SendVideoThankYouEmails() {
  const utils = api.useUtils();
  const status = api.videoSubmission.thankYouStatus.useQuery();

  const send = api.videoSubmission.sendThankYouEmails.useMutation({
    onSuccess: (result) => {
      if (result.failed.length > 0) {
        toast.error(
          `Sent ${result.sent}, but ${result.failed.length} failed: ${result.failed.join(", ")}`,
        );
      } else {
        toast.success(`Sent ${result.sent} thank-you emails.`);
      }
      void utils.videoSubmission.thankYouStatus.invalidate();
    },
    onError: (error) => {
      toast.error(
        error.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to send emails."
          : "Something went wrong sending emails.",
      );
    },
  });

  const pending = status.data?.pending;

  const handleClick = () => {
    if (
      !window.confirm(
        `Send the video contest thank-you email to ${pending ?? "all"} pending entr(ies)?`,
      )
    ) {
      return;
    }
    send.mutate();
  };

  return (
    <div className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
      <p className="text-sm text-white/70">
        {status.data
          ? `${status.data.pending} of ${status.data.total} video entries pending`
          : status.isError
            ? "Log in to see entry counts."
            : "Loading entries…"}
      </p>
      <Button
        onClick={handleClick}
        disabled={send.isPending || pending === 0}
        variant="secondary"
      >
        {send.isPending
          ? "Sending…"
          : pending === 0
            ? "All sent"
            : "Send to all pending"}
      </Button>
    </div>
  );
}
