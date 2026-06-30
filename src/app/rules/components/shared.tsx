export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-10 font-inclusive text-xl font-bold tracking-wide text-ink first:mt-0">
      {children}
    </h3>
  );
}

export function ProseLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-words underline underline-offset-4 transition-opacity hover:opacity-60"
    >
      {children}
    </a>
  );
}
