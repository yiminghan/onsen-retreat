"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/why", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/brand", label: "Brand" },
  { href: "mailto:hanyiming1995@gmail.com", label: "Sponsor" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="flex h-20 items-center justify-between px-6 sm:px-10">
        {/* Left — asterisk brand mark (home) */}
        <Link
          href="/"
          aria-label="Onsen Retreat — home"
          className="transition-opacity hover:opacity-70"
        >
          <Image
            src="/onsen-asterisk.svg"
            alt=""
            width={32}
            height={32}
            priority
            className="size-7 sm:size-8"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 md:flex lg:gap-16">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity hover:opacity-60 lg:text-xl"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 text-ink hover:bg-ink/5 hover:text-ink"
              >
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 border-none bg-sand p-1.5 ring-1 ring-ink/15"
            >
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  asChild
                  className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                >
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
