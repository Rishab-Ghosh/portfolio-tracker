interface HeroProps {
  title: string;
  subtitle: string;
  intro: string;
}

export function Hero({ title, subtitle, intro }: HeroProps) {
  return (
    <header className="border-b border-zinc-200/80 pb-14 pt-10 sm:pt-14">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Monitoring framework
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">{subtitle}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-700">{intro}</p>
    </header>
  );
}
