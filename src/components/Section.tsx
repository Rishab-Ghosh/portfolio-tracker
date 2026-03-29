interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-zinc-200 pt-14 pb-6 sm:pt-16 sm:pb-8">
      {eyebrow ? (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-3xl font-serif text-[1.35rem] font-medium leading-snug tracking-tight text-zinc-900 sm:text-[1.5rem]">
        {title}
      </h2>
      <div className="mt-9 sm:mt-10">{children}</div>
    </section>
  );
}
