"use client";

import { useState } from "react";

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

export function RulesGuides() {
  const [active, setActive] = useState<Guide["id"]>(ALL_GUIDES[0]!.id);
  const ActiveGuide =
    ALL_GUIDES.find((guide) => guide.id === active)?.Component ??
    ALL_GUIDES[0]!.Component;

  return (
    <div className="mt-16 lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
      {/* Grouped tab list — vertical on desktop, horizontal scroll on mobile */}
      <nav
        aria-label="Rules guides"
        className="-mx-6 mb-10 flex gap-8 overflow-x-auto border-b border-ink/10 px-6 pb-4 lg:sticky lg:top-28 lg:mx-0 lg:mb-0 lg:flex-col lg:gap-8 lg:self-start lg:overflow-visible lg:border-none lg:px-0 lg:pb-0"
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
                    onClick={() => setActive(guide.id)}
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
