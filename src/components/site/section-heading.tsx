export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="mb-8 grid gap-3 border-t border-border pt-6 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span aria-hidden className="inline-block h-3 w-1 bg-accent-red" />
        {eyebrow}
      </p>
      <div className="max-w-3xl">
        <h2
          id={id}
          className="font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl"
        >
          {title}
        </h2>
        {children ? (
          <div className="mt-3 text-base text-muted-foreground">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
