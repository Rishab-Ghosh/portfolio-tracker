import type { SiteMeta } from "@/types/data";

function formatLaunched(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Hero({ site }: { site: SiteMeta }) {
  return (
    <header className="border-b border-zinc-200 pb-11 pt-7 sm:pb-12 sm:pt-9">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        {site.thesisActive ? (
          <span className="border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-normal text-zinc-600">
            Monitor active
          </span>
        ) : null}
        <span className="text-[11px] text-zinc-500">
          <span className="text-zinc-400">Origin</span>{" "}
          <time className="text-zinc-600" dateTime={site.launched}>
            {formatLaunched(site.launched)}
          </time>
        </span>
      </div>
      <h1 className="mt-6 font-serif text-[1.85rem] font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-[2.2rem]">
        {site.title}
      </h1>
      <p className="mt-3 text-[0.8125rem] font-normal leading-snug text-zinc-600 sm:text-sm">
        {site.subtitle}
      </p>
      <p className="mt-6 max-w-[38rem] text-[15px] leading-[1.65] text-zinc-700">{site.intro}</p>
    </header>
  );
}
