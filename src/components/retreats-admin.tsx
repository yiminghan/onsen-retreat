"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { FileUpload } from "~/components/ui/file-upload";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  RETREAT_STATUSES,
  RETREAT_STATUS_LABELS,
  type RetreatStatus,
  formatRetreatDates,
} from "~/lib/retreat";
import { api } from "~/trpc/react";

type AdminRetreat = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  capacity: number | null;
  coverImage: string | null;
  status: string;
  applicationsCloseAt: Date | null;
  participantCount: number;
  applicationCount: number;
};

const STATUS_CLASSES: Record<RetreatStatus, string> = {
  draft: "border-ink/15 text-ink/40",
  open: "border-flame/50 text-flame",
  closed: "border-ink/25 text-ink/60",
  completed: "border-night/30 text-night/70",
};

/** Everything the form edits, as input-friendly strings. */
type FormState = {
  name: string;
  slug: string;
  status: RetreatStatus;
  location: string;
  startDate: string;
  endDate: string;
  capacity: string;
  applicationsCloseAt: string;
  coverImage: string;
  description: string;
};

/** Dates render and parse as UTC — same convention as formatRetreatDates. */
const dateToInput = (date: Date | null) =>
  date ? date.toISOString().slice(0, 10) : "";
const inputToDate = (value: string) =>
  value ? new Date(`${value}T00:00:00Z`) : null;

/** The application deadline is a local-time moment, not a calendar day. */
const dateTimeToInput = (date: Date | null) =>
  date
    ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 16)
    : "";
const inputToDateTime = (value: string) => (value ? new Date(value) : null);

const toFormState = (retreat?: AdminRetreat): FormState => ({
  name: retreat?.name ?? "",
  slug: retreat?.slug ?? "",
  status: (retreat?.status as RetreatStatus | undefined) ?? "draft",
  location: retreat?.location ?? "",
  startDate: dateToInput(retreat?.startDate ?? null),
  endDate: dateToInput(retreat?.endDate ?? null),
  capacity: retreat?.capacity ? String(retreat.capacity) : "",
  applicationsCloseAt: dateTimeToInput(retreat?.applicationsCloseAt ?? null),
  coverImage: retreat?.coverImage ?? "",
  description: retreat?.description ?? "",
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fieldClasses =
  "rounded-none border-0 border-b border-ink/20 bg-transparent px-0 text-ink shadow-none placeholder:text-ink/30 focus-visible:border-ink focus-visible:ring-0";

const labelClasses =
  "font-inclusive text-[0.6rem] tracking-[0.2em] text-ink/40 uppercase";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={labelClasses}>{label}</span>
      {children}
    </label>
  );
}

/**
 * Create/edit form for one retreat. Uncontrolled by the query cache — a fresh
 * `initial` snapshot seeds local state when the form mounts.
 */
function RetreatForm({
  retreat,
  onDone,
}: {
  retreat?: AdminRetreat;
  onDone: () => void;
}) {
  const utils = api.useUtils();
  const [form, setForm] = useState<FormState>(() => toFormState(retreat));
  // Until the slug is edited by hand, new retreats derive it from the name.
  const [slugTouched, setSlugTouched] = useState(!!retreat);

  const save = api.retreat.save.useMutation({
    onSuccess: async () => {
      await utils.retreat.adminList.invalidate();
      toast.success(retreat ? "Retreat updated." : "Retreat created.");
      onDone();
    },
    onError: (error) => toast.error(error.message || "Could not save."),
  });

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    save.mutate({
      id: retreat?.id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      status: form.status,
      location: form.location,
      startDate: inputToDate(form.startDate),
      endDate: inputToDate(form.endDate),
      capacity: form.capacity ? Number(form.capacity) : null,
      applicationsCloseAt: inputToDateTime(form.applicationsCloseAt),
      coverImage: form.coverImage,
      description: form.description,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name">
          <Input
            required
            maxLength={256}
            value={form.name}
            placeholder="Onsen Retreat 002"
            onChange={(e) =>
              set(
                slugTouched
                  ? { name: e.target.value }
                  : { name: e.target.value, slug: slugify(e.target.value) },
              )
            }
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
        <Field label="Slug — /retreats/…">
          <Input
            required
            maxLength={128}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens."
            value={form.slug}
            placeholder="onsen-002"
            onChange={(e) => {
              setSlugTouched(true);
              set({ slug: e.target.value });
            }}
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
      </div>

      <div>
        <span className={labelClasses}>Status</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {RETREAT_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => set({ status })}
              className={cn(
                "font-inclusive border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition",
                status === form.status
                  ? "border-ink bg-ink text-sand"
                  : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink",
              )}
            >
              {RETREAT_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Location">
          <Input
            maxLength={256}
            value={form.location}
            placeholder="Hakone, Japan"
            onChange={(e) => set({ location: e.target.value })}
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
        <Field label="Capacity — empty for uncapped">
          <Input
            type="number"
            min={1}
            max={10000}
            value={form.capacity}
            onChange={(e) => set({ capacity: e.target.value })}
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
        <Field label="Start date">
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
        <Field label="End date">
          <Input
            type="date"
            value={form.endDate}
            min={form.startDate || undefined}
            onChange={(e) => set({ endDate: e.target.value })}
            className={cn(fieldClasses, "mt-1")}
          />
        </Field>
      </div>

      <Field label="Applications close — empty to keep open while status is open">
        <Input
          type="datetime-local"
          value={form.applicationsCloseAt}
          onChange={(e) => set({ applicationsCloseAt: e.target.value })}
          className={cn(fieldClasses, "mt-1 sm:max-w-xs")}
        />
      </Field>

      <div>
        <span className={labelClasses}>Cover image</span>
        <FileUpload
          value={form.coverImage}
          onChange={(coverImage) => set({ coverImage })}
          className="mt-2"
        />
        <Input
          maxLength={2048}
          value={form.coverImage}
          placeholder="…or paste a URL: /retreat-2/cover.jpg or https://…"
          onChange={(e) => set({ coverImage: e.target.value })}
          className={cn(fieldClasses, "mt-2")}
        />
      </div>

      <Field label="Description — blank line between paragraphs">
        <Textarea
          rows={6}
          maxLength={20000}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          className={cn(fieldClasses, "mt-1 resize-y")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={save.isPending}
          className="border-ink bg-ink font-inclusive text-sand hover:bg-ink/85 border px-4 py-2 text-[0.6rem] tracking-[0.15em] uppercase transition disabled:opacity-40"
        >
          {save.isPending
            ? "Saving…"
            : retreat
              ? "Save changes"
              : "Create retreat"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border-ink/20 font-inclusive text-ink/60 hover:border-ink hover:text-ink border px-4 py-2 text-[0.6rem] tracking-[0.15em] uppercase transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Admin list of every retreat (drafts included) with inline edit and delete. */
export function RetreatsAdmin() {
  const utils = api.useUtils();
  const retreats = api.retreat.adminList.useQuery();
  // Which form is open: "new", a retreat id, or nothing.
  const [editing, setEditing] = useState<number | "new" | null>(null);

  const remove = api.retreat.remove.useMutation({
    onSuccess: async () => {
      await utils.retreat.adminList.invalidate();
      toast.success("Retreat deleted.");
    },
    onError: () => toast.error("Could not delete the retreat."),
  });

  const confirmDelete = (retreat: AdminRetreat) => {
    const confirmed = window.confirm(
      `Delete “${retreat.name}”?\n\nThis permanently removes the retreat, ` +
        `its ${retreat.applicationCount} application${retreat.applicationCount === 1 ? "" : "s"} ` +
        `and its roster of ${retreat.participantCount}. This cannot be undone.`,
    );
    if (confirmed) remove.mutate({ id: retreat.id });
  };

  return (
    <section className="mt-16">
      {editing === "new" ? (
        <div className="border-ink/10 bg-sand border p-6">
          <h2 className="font-display text-ink mb-6 text-2xl tracking-tight">
            New retreat
          </h2>
          <RetreatForm onDone={() => setEditing(null)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="border-ink bg-ink font-inclusive text-sand hover:bg-ink/85 border px-4 py-2 text-[0.6rem] tracking-[0.15em] uppercase transition"
        >
          + New retreat
        </button>
      )}

      {retreats.isPending ? (
        <p className="text-ink/50 mt-10 font-light">Loading…</p>
      ) : !retreats.data?.length ? (
        <p className="text-ink/50 mt-10 font-light">
          No retreats yet — create the first one above.
        </p>
      ) : (
        <ul className="bg-ink/10 mt-10 flex flex-col gap-px">
          {retreats.data.map((retreat) => {
            const status = retreat.status as RetreatStatus;
            const dates = formatRetreatDates(
              retreat.startDate,
              retreat.endDate,
            );
            const isEditing = editing === retreat.id;
            return (
              <li key={retreat.id} className="bg-sand p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-ink truncate text-xl tracking-tight">
                      {retreat.name}
                      <span className="font-inclusive text-ink/40 ml-2 text-xs">
                        /{retreat.slug}
                      </span>
                    </p>
                    <p className="text-ink/50 mt-1 truncate text-sm font-light">
                      {[dates, retreat.location].filter(Boolean).join(" · ") ||
                        "No dates set"}
                      {" · "}
                      {retreat.applicationCount} application
                      {retreat.applicationCount === 1 ? "" : "s"} ·{" "}
                      {retreat.participantCount}
                      {retreat.capacity ? `/${retreat.capacity}` : ""} in
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-inclusive shrink-0 border px-2 py-1 text-[0.6rem] tracking-[0.2em] uppercase",
                      STATUS_CLASSES[status] ?? STATUS_CLASSES.closed,
                    )}
                  >
                    {RETREAT_STATUS_LABELS[status] ?? retreat.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(isEditing ? null : retreat.id)}
                    className={cn(
                      "font-inclusive border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition",
                      isEditing
                        ? "border-ink bg-ink text-sand"
                        : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink",
                    )}
                  >
                    {isEditing ? "Close" : "Edit"}
                  </button>
                  <Link
                    href={`/admin/retreats/${retreat.slug}`}
                    className="border-ink/20 font-inclusive text-ink/60 hover:border-ink hover:text-ink border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition"
                  >
                    Applications ({retreat.applicationCount})
                  </Link>
                  {/* Drafts 404 on the public page, so there's nothing to view. */}
                  {status !== "draft" && (
                    <Link
                      href={`/retreats/${retreat.slug}`}
                      className="border-ink/20 font-inclusive text-ink/60 hover:border-ink hover:text-ink border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition"
                    >
                      View ↗
                    </Link>
                  )}
                  <button
                    type="button"
                    disabled={remove.isPending}
                    onClick={() => confirmDelete(retreat)}
                    className="border-flame/30 font-inclusive text-flame/80 hover:border-flame hover:text-flame border px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase transition disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>

                {isEditing && (
                  <div className="border-ink/10 mt-6 border-t pt-6">
                    <RetreatForm
                      retreat={retreat}
                      onDone={() => setEditing(null)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
