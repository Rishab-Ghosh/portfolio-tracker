interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-zinc-200/80 pt-12 pb-4">
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-2xl font-medium tracking-tight text-zinc-900 sm:text-[1.65rem]">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
