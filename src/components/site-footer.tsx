import Link from "next/link";

import { SignupDialog } from "~/components/signup-dialog";

export function SiteFooter() {
  return (
    <footer className="border-t border-onsen/15 bg-night">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5 flex-col flex items-start">
            <Link
              href="/"
              className="text-lg font-light tracking-[0.5em] text-steam uppercase"
            >
              Onsen Retreat
            </Link>
            <SignupDialog>
              <button className="text-[0.8rem] font-light tracking-[0.15em] text-ember uppercase underline-offset-8 transition-all hover:underline">
                Sign Up
              </button>
            </SignupDialog>
          </div>


        </div>

      </div>
    </footer>
  );
}
