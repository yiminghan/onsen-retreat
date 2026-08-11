"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const COMPANY_LINKS = [
  { href: "/brand", label: "Brand" },
  { href: "/retreats/retreat-001/rules", label: "Rules" },
  { href: "/sponsor", label: "Sponsor" },
];

const NAV_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "/retreats", label: "Retreats" },
  { href: "https://shop.onsen-retreat.com", label: "Shop", external: true },
];

const SHOW_AUTH = true;

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
  const router = useRouter();
  const isHome = pathname === "/";
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity outline-none hover:opacity-60 lg:text-xl">
              Company
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-44 border-none bg-sand p-1.5 ring-1 ring-ink/15"
            >
              {COMPANY_LINKS.map((link) => (
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

          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity hover:opacity-60 lg:text-xl"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity hover:opacity-60 lg:text-xl"
              >
                {link.label}
              </Link>
            ),
          )}

          {SHOW_AUTH &&
            !isPending &&
            (session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity hover:opacity-60 lg:text-xl">
                  {session.user.name.split(" ")[0]}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 border-none bg-sand p-1.5 ring-1 ring-ink/15"
                >
                  <DropdownMenuLabel className="px-2.5 py-2 text-xs font-light text-ink/50">
                    {session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-ink/10" />
                  <DropdownMenuItem
                    asChild
                    className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                  >
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="font-inclusive text-lg font-bold tracking-wide text-ink uppercase transition-opacity hover:opacity-60 lg:text-xl"
              >
                Log in
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink data-open:bg-ink/5 data-open:text-ink">
                  Company
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40 border-none bg-sand p-1.5 ring-1 ring-ink/15">
                  {COMPANY_LINKS.map((link) => (
                    <DropdownMenuItem
                      key={link.label}
                      asChild
                      className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  asChild
                  className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                >
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
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
              {SHOW_AUTH &&
                !isPending &&
                (session ? (
                  <>
                    <DropdownMenuItem
                      asChild
                      className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                    >
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleSignOut}
                      className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    asChild
                    className="px-2.5 py-2 font-inclusive text-sm font-bold tracking-wide text-ink uppercase focus:bg-ink/5 focus:text-ink"
                  >
                    <Link href="/login">Log in</Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
