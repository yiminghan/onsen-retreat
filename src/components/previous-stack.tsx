import Image from "next/image";

type Photo = {
  src: string;
  alt: string;
  /** Resting transform: small offset + rotation so the deck looks naturally stacked. */
  rest: string;
  /** Group-hover transform: fan the deck out into a row, rotation reset toward zero. */
  spread: string;
  z: string;
};

// Cards are centered with `inset-0 m-auto`, so each state needs only ONE
// translate-x. Per-index classes are static strings so Tailwind v4 can see them
// (no runtime-interpolated class names). The `group-hover:` variant has higher
// specificity than the resting class, so it wins while the deck is hovered.
const photos: Photo[] = [
  {
    src: "/images/previous-1.jpeg",
    alt: "Building together during the original onsen retreat",
    rest: "-translate-x-6 -rotate-6",
    spread: "group-hover:-translate-x-48 group-hover:rotate-0",
    z: "z-10",
  },
  {
    src: "/images/previous-2.jpeg",
    alt: "Soaking in the onsen at the retreat",
    rest: "-translate-x-2 -rotate-2",
    spread: "group-hover:-translate-x-16 group-hover:rotate-0",
    z: "z-20",
  },
  {
    src: "/images/previous-3.jpeg",
    alt: "Hiking near the onsen town",
    rest: "translate-x-2 rotate-3",
    spread: "group-hover:translate-x-16 group-hover:rotate-0",
    z: "z-30",
  },
  {
    src: "/images/previous-4.jpeg",
    alt: "Talking about technology at the retreat",
    rest: "translate-x-6 rotate-6",
    spread: "group-hover:translate-x-48 group-hover:rotate-0",
    z: "z-40",
  },
];

export function PreviousStack() {
  return (
    <figure className="not-prose relative">

      <div className="group relative mx-auto h-64 w-full max-w-xl sm:h-72">
        {photos.map((photo) => (
          <div
            key={photo.src}
            className={`absolute inset-0 m-auto h-44 w-32 overflow-hidden rounded-xl shadow-2xl shadow-black/40 ring-1 ring-ink/10 transition-transform duration-500 ease-out will-change-transform sm:h-52 sm:w-40 ${photo.z} ${photo.rest} ${photo.spread} hover:z-50 hover:-translate-y-4 hover:scale-105`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 160px, 200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </figure>
  );
}
