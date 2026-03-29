interface HeroProps {
  title: string;
  subtitle: string;
  intro: string;
}

export function Hero({ title, subtitle, intro }: HeroProps) {
  return (
    <header className="border-b border-zinc-200 pb-12 pt-8 sm:pb-14 sm:pt-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        Thesis monitor · U.S. urban AV · 5y
      </p>
      <h1 className="mt-4 font-serif text-[2rem] font-medium leading-tight tracking-tight text-zinc-950 sm:text-[2.35rem]">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-zinc-700">{subtitle}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">{intro}</p>
    </header>
  );
}
