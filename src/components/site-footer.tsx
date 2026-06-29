import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative flex flex-col items-center gap-6 border-t border-ink/15 px-6 py-20 text-center">
      <Link
        href="/signup"
        className="border-b border-ink/40 pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ink/80 uppercase transition-colors hover:border-ink hover:text-ink"
      >
        Sign Up
      </Link>
    </footer>
  );
}
