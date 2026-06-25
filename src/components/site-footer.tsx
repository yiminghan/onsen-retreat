import { SignupDialog } from "~/components/signup-dialog";

export function SiteFooter() {
  return (
    <footer className="relative flex flex-col items-center gap-6 border-t border-onsen/15 px-6 py-20 text-center">
      <SignupDialog>
        <button className="border-b border-ember pb-1 text-[0.8rem] font-light tracking-[0.3em] text-ember uppercase transition-colors hover:text-steam">
          Sign Up
        </button>
      </SignupDialog>
    </footer>
  );
}
