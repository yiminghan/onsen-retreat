"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SignupDialog } from "~/components/signup-dialog";

const NAV_LINKS = [
  { href: "/why", label: "Why?" },
];

const DISCORD_URL = "https://discord.com/invite/fhqu7GY42";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.607-.719 1.4-.984 2.022a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-1-2.022.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C1.533 7.55.93 10.654 1.226 13.717a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-3.518-.838-6.596-2.55-9.32a.061.061 0 0 0-.031-.028ZM8.02 11.852c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
    </svg>
  );
}

export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const overlay = variant === "overlay";

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-30",
        overlay
          ? "bg-gradient-to-b from-black/50 to-transparent"
          : "border-b border-onsen/15 bg-night",
      )}
    >
      <nav className="mx-auto grid h-24 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Left — language toggle */}
        <div className="hidden md:flex">
        </div>

        {/* Mobile menu (left on small screens) */}
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 text-steam hover:bg-white/10 hover:text-onsen"
              >
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-44 border-none bg-night p-1.5 ring-1 ring-onsen/15"
            >
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  asChild
                  className="px-2.5 py-2 text-[0.8rem] font-light tracking-[0.15em] text-steam/80 uppercase focus:bg-onsen/10 focus:text-onsen"
                >
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                asChild
                className="px-2.5 py-2 text-[0.8rem] font-light tracking-[0.15em] text-steam/80 uppercase focus:bg-onsen/10 focus:text-onsen"
              >
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5"
                >
                  <DiscordIcon className="size-4" />
                  Discord
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center — brand */}
        <Link
          href="/"
          className="justify-self-center text-center text-lg font-light tracking-[0.5em] text-steam uppercase transition-opacity hover:opacity-80 sm:text-xl"
        >
          Onsen Retreat
        </Link>

        {/* Right — nav + cta */}
        <div className="hidden items-center justify-end gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.8rem] font-light tracking-[0.15em] text-steam/70 uppercase transition-colors hover:text-onsen"
            >
              {link.label}
            </Link>
          ))}

          <SignupDialog>
            <button className="text-[0.8rem] font-light tracking-[0.15em] text-ember uppercase underline-offset-8 transition-all hover:underline">
              Sign Up
            </button>
          </SignupDialog>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Discord"
            className="text-steam/70 transition-colors hover:text-onsen"
          >
            <DiscordIcon className="size-5" />
          </a>
        </div>

        {/* Right — mobile cta */}
        <div className="flex justify-end md:hidden">
          <SignupDialog>
            <button className="text-[0.7rem] font-light tracking-[0.15em] text-ember uppercase">
              Sign Up
            </button>
          </SignupDialog>
        </div>
      </nav>
    </header>
  );
}
