"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type RetreatRule = {
  id: number;
  sectionId: string;
  label: string;
  groupLabel: string;
  content: string;
};

/**
 * Markdown element styling matched to the hand-written guides on /rules —
 * headings render like SubHeading, links like ProseLink, bold like the
 * `font-medium text-ink` emphasis spans.
 */
const heading = (children: React.ReactNode) => (
  <h3 className="mt-10 font-inclusive text-xl font-bold tracking-wide text-ink first:mt-0">
    {children}
  </h3>
);

const markdownComponents: Components = {
  h1: ({ children }) => heading(children),
  h2: ({ children }) => heading(children),
  h3: ({ children }) => heading(children),
  a: ({ href = "", children }) => {
    // Hash links swap the active section in place and internal paths stay in
    // the same tab; only true external links open a new one.
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="break-words underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <span className="font-medium text-ink">{children}</span>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-5">{children}</ol>
  ),
};

function RuleContent({ content }: { content: string }) {
  return (
    <div className="space-y-5 text-lg font-light leading-relaxed tracking-wide text-ink/75">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}

/**
 * DB-driven version of the switcher on /rules (rules-guides.tsx): grouped
 * sidebar on desktop, dropdown on mobile, hash deep-links, markdown content.
 */
export function RetreatRulesGuides({ rules }: { rules: RetreatRule[] }) {
  // Group in first-seen order so `sortOrder` controls both section and group
  // ordering.
  const groups: { label: string; rules: RetreatRule[] }[] = [];
  for (const rule of rules) {
    const group = groups.find((g) => g.label === rule.groupLabel);
    if (group) group.rules.push(rule);
    else groups.push({ label: rule.groupLabel, rules: [rule] });
  }

  const validIds = new Set(rules.map((rule) => rule.sectionId));
  const [active, setActive] = useState(rules[0]!.sectionId);

  // Deep-link support: open the section named in the URL hash (e.g.
  // /retreats/001/rules#video-contest), and keep responding to hash changes.
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (validIds.has(id)) setActive(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectSection = (id: string) => {
    setActive(id);
    // Reflect the active section in the URL so it's shareable, without the
    // jump a plain hash navigation would cause.
    window.history.replaceState(null, "", `#${id}`);
  };

  const activeRule = rules.find((rule) => rule.sectionId === active) ?? rules[0]!;

  return (
    <div className="mt-16 lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
      {/* Mobile: a single dropdown keeps every section reachable in one tap. */}
      <div className="mb-10 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex w-full items-center justify-between border-b border-ink/20 py-3 font-inclusive text-sm font-bold tracking-wide text-ink uppercase outline-none data-[state=open]:border-ink">
            <span>{activeRule.label}</span>
            <ChevronDownIcon className="size-4 text-ink/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-sand text-ink ring-ink/10"
          >
            <DropdownMenuRadioGroup value={active} onValueChange={selectSection}>
              {groups.map((group, i) => (
                <Fragment key={group.label}>
                  {i > 0 && <DropdownMenuSeparator className="bg-ink/10" />}
                  <DropdownMenuLabel className="font-inclusive text-[0.65rem] font-bold tracking-[0.2em] text-ink/40 uppercase">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.rules.map((rule) => (
                    <DropdownMenuRadioItem
                      key={rule.sectionId}
                      value={rule.sectionId}
                      className="font-inclusive text-sm font-bold tracking-wide text-ink/70 uppercase focus:bg-ink/5 focus:text-ink data-[state=checked]:text-flame"
                    >
                      {rule.label}
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
        {groups.map((group) => (
          <div
            key={group.label}
            className="flex shrink-0 flex-col gap-3 lg:shrink"
          >
            <p className="font-inclusive text-xs font-bold tracking-[0.2em] text-ink/40 uppercase">
              {group.label}
            </p>
            <div className="flex gap-6 lg:flex-col lg:gap-3">
              {group.rules.map((rule) => {
                const isActive = rule.sectionId === active;
                return (
                  <button
                    key={rule.sectionId}
                    type="button"
                    onClick={() => selectSection(rule.sectionId)}
                    aria-current={isActive ? "true" : undefined}
                    className={`shrink-0 text-left font-inclusive text-sm font-bold tracking-wide uppercase transition-colors ${
                      isActive ? "text-flame" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    {rule.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Active section */}
      <div>
        <RuleContent content={activeRule.content} />
      </div>
    </div>
  );
}
