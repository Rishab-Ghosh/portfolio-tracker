import { Hero } from "@/components/Hero";
import { KPIMonitor } from "@/components/KPIMonitor";
import { PositionTracker } from "@/components/PositionTracker";
import { ScenarioFramework } from "@/components/ScenarioFramework";
import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { ThesisIntegrity } from "@/components/ThesisIntegrity";
import { ThesisJournal } from "@/components/ThesisJournal";
import { ThesisOverview } from "@/components/ThesisOverview";
import site from "@data/site.json";
import thesis from "@data/thesis.json";
import positions from "@data/positions.json";
import kpis from "@data/kpis.json";
import scenarios from "@data/scenarios.json";
import journal from "@data/journal.json";
import falsification from "@data/falsification.json";
import footer from "@data/footer.json";
import type { JournalEntry, Kpi, Position, Scenarios } from "@/types/data";

const positionsData = positions as Position[];
const kpisData = kpis as Kpi[];
const scenariosData = scenarios as Scenarios;
const journalData = journal as JournalEntry[];

const contents = [
  ["thesis-overview", "Thesis"],
  ["positions", "Positions"],
  ["kpis", "KPIs"],
  ["scenarios", "Scenarios"],
  ["journal", "Journal"],
  ["falsification", "Falsification"],
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f7f6]">
      <a
        href="#thesis-overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-zinc-300 focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-900"
      >
        Skip to content
      </a>
      <main className="mx-auto w-full max-w-[52rem] flex-1 px-5 pb-20 sm:px-10">
        <Hero title={site.title} subtitle={site.subtitle} intro={site.intro} />

        <nav
          className="border-b border-zinc-200 py-3"
          aria-label="Section links"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Contents
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-1 text-[12px] text-zinc-600">
            {contents.map(([id, label], i) => (
              <li key={id} className="flex items-center gap-x-1">
                {i > 0 ? <span className="text-zinc-300" aria-hidden>·</span> : null}
                <a href={`#${id}`} className="hover:text-zinc-900">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="thesis-overview" eyebrow="I" title="Thesis">
          <ThesisOverview coreThesis={thesis.coreThesis} drivers={thesis.drivers} />
        </Section>

        <Section id="positions" eyebrow="II" title="Positions">
          <PositionTracker positions={positionsData} />
        </Section>

        <Section id="kpis" eyebrow="III" title="Key performance indicators">
          <KPIMonitor kpis={kpisData} />
        </Section>

        <Section id="scenarios" eyebrow="IV" title="Scenarios">
          <ScenarioFramework scenarios={scenariosData} />
        </Section>

        <Section id="journal" eyebrow="V" title="Journal">
          <ThesisJournal entries={journalData} />
        </Section>

        <Section id="falsification" eyebrow="VI" title="What would prove this wrong">
          <ThesisIntegrity items={falsification.items} />
        </Section>

        <SiteFooter line={footer.line} githubUrl={footer.githubUrl} disclaimer={footer.disclaimer} />
      </main>
    </div>
  );
}
