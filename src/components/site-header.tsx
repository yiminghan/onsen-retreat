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
            <DropdownMenuContent align="start" className="w-44">
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
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
