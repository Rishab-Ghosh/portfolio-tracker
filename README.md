# Live Thesis Tracker

**Trade-desk style monitor** for a **theoretical $100,000 book** incepted **27 Mar 2026**, benchmarked to **SPY** (or the ticker in `data/market.json`). The UI shows NAV, an equity curve (portfolio vs benchmark index level), a position blotter, scenario readout, compact thesis signals, and falsification conditions.

Not a live brokerage account. No auth, no database.

## Tech stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** v4 + **Recharts** (equity curve)
- **Finnhub** on the server (`GET /api/portfolio`): daily candles from inception + latest quotes; API key never sent to the browser
- Static **JSON** under `data/`; **`src/types/data.ts`**, **`src/types/portfolio-api.ts`**, **`src/types/desk-kpi.ts`** describe shapes

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server ([http://localhost:3000](http://localhost:3000)) |
| `npm run build` | Production build |
| `npm start` | Run production build locally |
| `npm run lint` | ESLint (Next core-web-vitals) |

## Run locally

1. **Install**

   ```bash
   cd /path/to/live-thesis-tracker
   npm install
   ```

2. **Environment (optional, for live marks)**

   ```bash
   cp .env.example .env.local
   ```

   Set `FINNHUB_API_KEY` in `.env.local` ([register at Finnhub](https://finnhub.io/register)). Without it, the portfolio engine uses **`offlinePrice`** per position and **`offlineBenchmarkPrice`** in `data/market.json` (flat synthetic series + same marks).

3. **Start**

   ```bash
   npm run dev
   ```

4. **Sanity check**

   ```bash
   npm run lint
   npm run build
   ```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| **`FINNHUB_API_KEY`** | No | Server-only in `src/lib/finnhub.ts` and `src/app/api/portfolio/route.ts`. |

## Portfolio engine (summary)

- **Inception**: `data/market.json` → `inceptionDate`, `startingNav` ($100k).
- **Positions**: `data/positions.json` → signed **`allocationUsd`** (shorts negative). Shares at inception = `allocationUsd / first valid close on/before first SPY session ≥ inception` (with **`offlinePrice`** fallback).
- **Marking**: Walk **SPY** daily calendar; each stock is **forward-filled** on that calendar. Last point is overwritten with **live quotes** when Finnhub returns them.
- **Benchmark line**: Same SPY series scaled so benchmark **NAV** = starting NAV × (SPY\_t / SPY\_inception); not a held position in the book.
- **P&L / stats**: Unrealized per line = `marketValue − allocationUsd`; contribution % vs **total** portfolio P&L; gross/net exposure as % of current NAV from absolute and signed market values.

## API: `GET /api/portfolio`

Returns **`PortfolioApiResponse`** (`src/types/portfolio-api.ts`): `ok`, optional `warning`, inception fields, `header` (NAV, returns, alpha, day P&L), `stats` (gross/net exposure %, position count), `series` (`date`, `nav`, `benchNav`), `positions` (blotter rows). On severe failure, `ok: false` with empty series/positions and a warning string.

## Project structure (high level)

```
├── data/
│   ├── site.json
│   ├── positions.json      # allocationUsd, thesisLine, status, offlinePrice, …
│   ├── market.json         # benchmark, inception, startingNav, currentLean, poll
│   ├── scenarios.json
│   ├── kpis.json           # compact desk KPI rows
│   ├── falsification.json
│   └── footer.json
├── src/
│   ├── app/api/portfolio/route.ts
│   ├── lib/finnhub.ts
│   ├── lib/portfolio-engine.ts
│   └── components/trade-desk/
```

## Where to edit content

| File | What to change |
|------|----------------|
| `data/site.json` | **title**, **subtitle**, **tagline** |
| `data/positions.json` | **allocationUsd** (signed), **ticker**, **side**, **category**, **offlinePrice**, **thesisLine**, **status** |
| `data/market.json` | **benchmarkTicker**, **inceptionDate**, **startingNav**, **currentLean** (`bull` \| `base` \| `bear`), **pollIntervalSeconds**, **offlineBenchmarkPrice** |
| `data/scenarios.json` | **bull** / **base** / **bear** cards |
| `data/kpis.json` | **name**, **signal**, **direction** (`up` \| `down` \| `flat` \| `na`), **interpretation**, **status** |
| `data/falsification.json` | **items[]** |
| `data/footer.json` | **line**, **githubUrl**, **disclaimer** |

Position **status** (badges): `tracking`, `validated`, `under review`, `broken`.

## Deploy to Vercel

1. Import the repo; framework **Next.js**.
2. Set **`FINNHUB_API_KEY`** for live historical + last marks.

## Disclaimer

Thesis documentation only—not investment advice. See `data/footer.json`.
