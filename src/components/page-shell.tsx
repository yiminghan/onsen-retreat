import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { SignupDialog } from "~/components/signup-dialog";

export function PageShell({
  eyebrow,
  title,
  kanji,
  children,
}: {
  eyebrow: string;
  title: string;
  kanji?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-night text-steam">
      <SiteHeader variant="solid" />

      <main className="relative mx-auto max-w-3xl px-6 pt-44 pb-28">
        {kanji && (
          <span
            className="pointer-events-none absolute top-28 right-0 -z-0 text-[16rem] leading-none text-steam/[0.03] select-none"
            aria-hidden
          >
            {kanji}
          </span>
        )}

        <header className="relative border-b border-onsen/15 pb-12 text-center">
          <p className="text-[0.7rem] font-light tracking-[0.45em] text-onsen uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-extralight leading-[1.15] tracking-tight text-steam sm:text-5xl">
            {title}
          </h1>
        </header>

        <div className="prose-onsen relative mt-14 space-y-7 text-lg font-light leading-relaxed tracking-wide text-steam/75">
          {children}
        </div>

        <div className="relative mt-20 flex flex-col items-center gap-6 border-t border-onsen/15 pt-12 text-center">
          <SignupDialog>
            <button className="border-b border-ember pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ember uppercase transition-colors hover:text-steam">
              Sign Up
            </button>
          </SignupDialog>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
