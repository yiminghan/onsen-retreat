import { Hero } from "~/components/hero";
import { Philosophy } from "~/components/philosophy";
import { Why } from "~/components/why";
import { Program } from "~/components/program";
import { Faq } from "~/components/faq";

export default function Home() {
  return (
    <div className="bg-sand text-ink">
      <Hero />
      <Philosophy />
      {false && <Why />}
      <Program />
      <Faq />
    </div>
  );
}
