"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/brand", label: "Brand" },
  { href: "/rules", label: "Rules" },
  { href: "/sponsor", label: "Sponsor" },
];

const INSTAGRAM_URL = "https://www.instagram.com/onsenretreat";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="flex h-20 items-center justify-between px-6 sm:px-10">
        {/* Left — asterisk brand mark (brand). Hidden on the home page, where
            the hero already features the wordmark's asterisk. */}
        {isHome ? (
          <span aria-hidden />
        ) : (
          <Link
            href="/"
            aria-label="Onsen Retreat — brand"
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
        )}

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 md:flex lg:gap-16">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Onsen Retreat on Instagram"
            className="text-ink transition-opacity hover:opacity-60"
          >
            <InstagramIcon className="size-6" />
          </a>
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
              <DropdownMenuItem
                asChild
                className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
              >
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="size-4" />
                  Instagram
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
