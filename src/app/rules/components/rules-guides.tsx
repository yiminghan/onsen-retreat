"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { AboutGuide } from "./about";
import { VideoContestGuide } from "./video-contest";
import { HackathonGuide } from "./hackathon";
import { ArtDesignContestGuide } from "./art-design-contest";
import { EligibilityGuide } from "./eligibility";
import { VisaGuide } from "./visa";
import { ExpensesGuide } from "./expenses";
import { IntellectualPropertyGuide } from "./intellectual-property";

type Guide = {
  id: string;
  label: string;
  Component: () => React.ReactNode;
};

type GuideGroup = {
  label: string;
  guides: Guide[];
};

const GROUPS: GuideGroup[] = [
  {
    label: "General",
    guides: [
      { id: "about", label: "About", Component: AboutGuide },
      { id: "eligibility", label: "Eligibility", Component: EligibilityGuide },
      { id: "visa", label: "Visa & Travel", Component: VisaGuide },
      { id: "expenses", label: "Expenses", Component: ExpensesGuide },
      {
        id: "intellectual-property",
        label: "Intellectual Property",
        Component: IntellectualPropertyGuide,
      },
    ],
  },
  {
    label: "Contests",
    guides: [
      {
        id: "video-contest",
        label: "Video Contest",
        Component: VideoContestGuide,
      },
      {
        id: "hackathon",
        label: "Hackathon",
        Component: HackathonGuide,
      },
      {
        id: "art-design-contest",
        label: "Art / Design Contest",
        Component: ArtDesignContestGuide,
      },
    ],
  },
];

const ALL_GUIDES = GROUPS.flatMap((group) => group.guides);
const VALID_IDS = new Set(ALL_GUIDES.map((guide) => guide.id));

export function RulesGuides() {
  const [active, setActive] = useState<Guide["id"]>(ALL_GUIDES[0]!.id);

  // Deep-link support: open the guide named in the URL hash (e.g.
  // /rules#video-contest), and keep responding to in-page hash changes.
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (VALID_IDS.has(id)) setActive(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectGuide = (id: Guide["id"]) => {
    setActive(id);
    // Reflect the active guide in the URL so it's shareable, without the jump
    // a plain hash navigation would cause.
    window.history.replaceState(null, "", `#${id}`);
  };

  const activeGuide =
    ALL_GUIDES.find((guide) => guide.id === active) ?? ALL_GUIDES[0]!;
  const ActiveGuide = activeGuide.Component;

  return (
    <div className="mt-16 lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
      {/* Mobile: a single dropdown keeps every guide reachable in one tap
          instead of a cramped, easy-to-miss horizontal scroll strip. */}
      <div className="mb-10 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex w-full items-center justify-between border-b border-ink/20 py-3 font-inclusive text-sm font-bold tracking-wide text-ink uppercase outline-none data-[state=open]:border-ink">
            <span>{activeGuide.label}</span>
            <ChevronDownIcon className="size-4 text-ink/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-sand text-ink ring-ink/10"
          >
            <DropdownMenuRadioGroup value={active} onValueChange={selectGuide}>
              {GROUPS.map((group, i) => (
                <Fragment key={group.label}>
                  {i > 0 && <DropdownMenuSeparator className="bg-ink/10" />}
                  <DropdownMenuLabel className="font-inclusive text-[0.65rem] font-bold tracking-[0.2em] text-ink/40 uppercase">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.guides.map((guide) => (
                    <DropdownMenuRadioItem
                      key={guide.id}
                      value={guide.id}
                      className="font-inclusive text-sm font-bold tracking-wide text-ink/70 uppercase focus:bg-ink/5 focus:text-ink data-[state=checked]:text-flame"
                    >
                      {guide.label}
                    </DropdownMenuRadioItem>
                  ))}
                </Fragment>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: grouped vertical sidebar */}
      <nav
        aria-label="Rules guides"
        className="hidden lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-8 lg:self-start"
      >
        {GROUPS.map((group) => (
          <div
            key={group.label}
            className="flex shrink-0 flex-col gap-3 lg:shrink"
          >
            <p className="font-inclusive text-xs font-bold tracking-[0.2em] text-ink/40 uppercase">
              {group.label}
            </p>
            <div className="flex gap-6 lg:flex-col lg:gap-3">
              {group.guides.map((guide) => {
                const isActive = guide.id === active;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => selectGuide(guide.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`shrink-0 text-left font-inclusive text-sm font-bold tracking-wide uppercase transition-colors ${isActive ? "text-flame" : "text-ink/55 hover:text-ink"
                      }`}
                  >
                    {guide.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Active guide */}
      <div>
        <ActiveGuide />
      </div>
    </div>
  );
}
