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
    <header className="border-b border-zinc-200 pb-12 pt-8 sm:pb-14 sm:pt-10">
      <div className="flex flex-wrap items-center gap-2 gap-y-2">
        {site.thesisActive ? (
          <span className="rounded-sm border border-zinc-300 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-700">
            Thesis active
          </span>
        ) : null}
        <span className="text-[11px] text-zinc-500">
          Launched <time dateTime={site.launched}>{formatLaunched(site.launched)}</time>
        </span>
      </div>
      <h1 className="mt-5 font-serif text-[2rem] font-medium leading-tight tracking-tight text-zinc-950 sm:text-[2.35rem]">
        {site.title}
      </h1>
      <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.12em] text-zinc-600">
        {site.subtitle}
      </p>
      <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-zinc-700">{site.intro}</p>
    </header>
  );
}
