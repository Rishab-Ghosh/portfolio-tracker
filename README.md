# Live Thesis Tracker

**Investment monitoring dashboard**—a hosted appendix to a five-year thesis on autonomous passenger mobility in major U.S. cities. It is structured so a reviewer can quickly see: **thesis**, **positions**, **live price evidence**, **scenario posture**, **non-price KPIs**, **dated updates**, and **what would prove the view wrong**.

Not a retail trading UI. No auth, no database.

## Tech stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** v4
- **Finnhub** quotes via a **server-only** route (`/api/quotes`); API key stays off the client
- Static **JSON** under `data/` for thesis copy, positions (entry + offline fallback), KPIs, scenarios, journal, falsification, footer

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment template and add your Finnhub key:

   ```bash
   cp .env.example .env.local
   ```

   Get a free key at [finnhub.io](https://finnhub.io/register). Set:

   ```env
   FINNHUB_API_KEY=your_key_here
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. Production build:

   ```bash
   npm run build
   npm start
   ```

### If live quotes do not work

- Confirm `FINNHUB_API_KEY` is set in `.env.local` (local) or Vercel env (deployed).
- Finnhub free tier has **rate limits**; the app polls every **60–300s** (default **120s** from `data/market.json`).
- If the API errors or a symbol fails, the UI falls back to **`offlineQuote`** in `data/positions.json` so the page still renders.

## Environment variables

| Variable            | Required | Where used                          |
|---------------------|----------|-------------------------------------|
| `FINNHUB_API_KEY`   | Optional | Server: `src/app/api/quotes/route.ts`, `src/lib/finnhub.ts` |

See `.env.example`.

## Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Framework: **Next.js** (default). Build: `npm run build`.
3. Add **`FINNHUB_API_KEY`** under **Settings → Environment Variables** (Production / Preview as needed).
4. Deploy. No database or extra services required.

## Where to edit content

| File | What to change |
|------|----------------|
| `data/site.json` | Title, subtitle (“Investment Monitoring Dashboard”), intro, **launched** date, **thesisActive** badge |
| `data/thesis.json` | Core thesis, **drivers**, **winners**, **losers**, **whyMatters** |
| `data/positions.json` | Sleeves, entry date/price, **offlineQuote** (fallback), thesis line, **status** (`tracking` / `validated` / `under review` / `broken`) |
| `data/market.json` | **benchmarkTicker** (e.g. `SPY`), **pollIntervalSeconds** (60–300) |
| `data/scenarios.json` | Upside / base / downside: description, confirming signals, implications, who benefits / hurt, **monitorStatus** |
| `data/kpis.json` | KPI name, **sourceType** (`manual` \| `api`), **currentStatus**, interpretation, **trend** |
| `data/journal.json` | Dated entries; optional **tags** array |
| `data/falsification.json` | Conditions that would weaken or invalidate the thesis |
| `data/footer.json` | Companion note, GitHub URL, disclaimer |

Position **status** and scenario **monitorStatus** values must match the TypeScript unions in `src/types/data.ts`.

## Market data notes

- **Last price** and **benchmark** (`SPY` by default) come from Finnhub **quote** endpoints on the server.
- **vs SPY** is **position return since open** minus **SPY total return** from the position’s entry date (daily candles for SPY; close on or before open date vs current quote). This is a simple relative measure, not a formal alpha estimate.

## License / disclaimer

This project is **thesis documentation only**, not investment advice. See `data/footer.json` for the on-site disclaimer.
