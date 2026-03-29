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

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50/80">
      <a
        href="#thesis-overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow focus:ring-1 focus:ring-zinc-300"
      >
        Skip to content
      </a>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-16 sm:px-8">
        <Hero title={site.title} subtitle={site.subtitle} intro={site.intro} />

        <nav
          className="sticky top-0 z-40 -mx-5 mb-2 border-b border-zinc-200/90 bg-zinc-50/95 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8"
          aria-label="Section navigation"
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-zinc-600">
            {[
              ["thesis-overview", "Thesis"],
              ["positions", "Positions"],
              ["kpis", "KPIs"],
              ["scenarios", "Scenarios"],
              ["journal", "Journal"],
              ["falsification", "Falsification"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-zinc-900">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="thesis-overview" eyebrow="Overview" title="Thesis">
          <ThesisOverview coreThesis={thesis.coreThesis} drivers={thesis.drivers} />
        </Section>

        <Section id="positions" eyebrow="Portfolio" title="Position tracker">
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Expressed views and monitoring status. Current prices are placeholders until wired to
            a data source; update <code className="rounded bg-zinc-100 px-1 font-mono text-xs">data/positions.json</code>{" "}
            as needed.
          </p>
          <PositionTracker positions={positionsData} />
        </Section>

        <Section id="kpis" eyebrow="Evidence" title="KPI monitor">
          <KPIMonitor kpis={kpisData} />
        </Section>

        <Section id="scenarios" eyebrow="Outcomes" title="Scenario framework">
          <ScenarioFramework scenarios={scenariosData} />
        </Section>

        <Section id="journal" eyebrow="Log" title="Thesis journal">
          <ThesisJournal entries={journalData} />
        </Section>

        <Section id="falsification" eyebrow="Discipline" title="What would prove me wrong">
          <ThesisIntegrity items={falsification.items} />
        </Section>

        <SiteFooter line={footer.line} githubUrl={footer.githubUrl} disclaimer={footer.disclaimer} />
      </main>
    </div>
  );
}
