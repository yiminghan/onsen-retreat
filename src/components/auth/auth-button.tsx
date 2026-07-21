"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AuthButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> & {
  variant?: "solid" | "outline";
};

/**
 * Branded button for the auth flows — shadcn Button with Onsen Retreat
 * styling: Inclusive Sans, uppercase letterspacing, ink/sand palette.
 */
export function AuthButton({
  variant = "solid",
  className,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      variant={variant === "solid" ? "default" : "outline"}
      size="lg"
      className={cn(
        "h-11 rounded-none px-8 font-inclusive text-[0.8rem] font-bold tracking-[0.25em] uppercase",
        variant === "solid"
          ? "bg-ink text-sand hover:bg-ink/85"
          : "border-ink/25 bg-transparent text-ink/80 hover:border-ink hover:bg-transparent hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
