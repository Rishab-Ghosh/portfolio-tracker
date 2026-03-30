import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { ThesisIntegrity } from "@/components/ThesisIntegrity";
import { TradeDesk } from "@/components/trade-desk/TradeDesk";
import footer from "@data/footer.json";
import falsification from "@data/falsification.json";
import kpis from "@data/kpis.json";
import market from "@data/market.json";
import scenarios from "@data/scenarios.json";
import site from "@data/site.json";
import type { DeskKpi } from "@/types/desk-kpi";
import type { KillSwitch, MarketConfig, Scenarios } from "@/types/data";

const scenariosData = scenarios as Scenarios;
const kpisData = kpis as DeskKpi[];
const marketData = market as MarketConfig;
const killSwitches = falsification.items as KillSwitch[];

const pollMs = Math.min(
  Math.max((marketData.pollIntervalSeconds ?? 120) * 1000, 60_000),
  300_000,
);

const contents = [
  ["chart", "Chart"],
  ["blotter", "Blotter"],
  ["scenarios", "Scenarios"],
  ["evidence", "Signals"],
  ["falsification", "Kill switches"],
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <a
        href="#chart"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-zinc-600 focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-100"
      >
        Skip to content
      </a>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8">
        <nav
          className="mb-8 border-b border-zinc-800 pb-3"
          aria-label="Section links"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">
            Contents
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-2 text-[12px] text-zinc-500">
            {contents.map(([id, label], i) => (
              <li key={id} className="flex items-center gap-x-1.5">
                {i > 0 ? (
                  <span className="select-none text-zinc-700" aria-hidden>
                    ·
                  </span>
                ) : null}
                <a
                  href={`#${id}`}
                  className="rounded-sm px-0.5 decoration-zinc-600 underline-offset-[4px] hover:text-zinc-200 hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <TradeDesk
          siteTitle={site.title}
          siteSubtitle={site.subtitle}
          siteTagline={site.tagline}
          scenarios={scenariosData}
          kpis={kpisData}
          pollIntervalMs={pollMs}
        />

        <Section id="falsification" title="Kill switches">
          <ThesisIntegrity items={killSwitches} />
        </Section>

        <SiteFooter line={footer.line} githubUrl={footer.githubUrl} disclaimer={footer.disclaimer} />
      </main>
    </div>
  );
}
