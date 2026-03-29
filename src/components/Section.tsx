interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-10 border-t border-zinc-200 pt-12 pb-8 sm:scroll-mt-12 sm:pt-14 sm:pb-10"
    >
      {eyebrow ? (
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-2xl font-serif text-[1.3125rem] font-medium leading-snug tracking-tight text-zinc-900 sm:text-[1.4375rem]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 max-w-[38rem] text-[13px] leading-relaxed text-zinc-600">{lead}</p>
      ) : null}
      <div className={lead ? "mt-8 sm:mt-9" : "mt-8 sm:mt-10"}>{children}</div>
    </section>
  );
}
