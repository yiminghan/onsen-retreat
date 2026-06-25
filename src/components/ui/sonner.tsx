"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-onsen" />
        ),
        info: (
          <InfoIcon className="size-4 text-onsen" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-onsen" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-ember" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-steam/60" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--color-night)",
          "--normal-text": "var(--color-steam)",
          "--normal-border": "color-mix(in oklch, var(--color-onsen) 18%, transparent)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          title: "font-light tracking-tight text-steam",
          description: "font-light text-steam/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
