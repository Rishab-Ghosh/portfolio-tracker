# Live Thesis Tracker

**Investment monitoring dashboard**—a hosted appendix to a five-year thesis on autonomous passenger mobility in major U.S. cities. It is structured so a reviewer can quickly see: **thesis**, **positions**, **live price evidence**, **scenario posture**, **non-price KPIs**, **dated updates**, and **what would prove the view wrong**.

Not a retail trading UI. No auth, no database.

## Tech stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** v4
- **Finnhub** quotes via a **server-only** route (`GET /api/quotes`); API key stays off the client
- Static **JSON** under `data/` for all editorial content; **`src/types/data.ts`** describes the expected JSON shapes

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

2. **Environment (optional, for live prices)**

   ```bash
   cp .env.example .env.local
   ```

   Set `FINNHUB_API_KEY` in `.env.local` ([register at Finnhub](https://finnhub.io/register)). Without it, the app still runs using **`offlineQuote`** in `data/positions.json`.

3. **Start**

   ```bash
   npm run dev
   ```

   Open **http://localhost:3000**. All sections render on the home page (single route `/`).

4. **Sanity check**

   ```bash
   npm run lint
   npm run build
   ```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| **`FINNHUB_API_KEY`** | No (omit = offline prices only) | Finnhub token; **server-only** in `src/lib/finnhub.ts` and `src/app/api/quotes/route.ts`. Never sent to the browser. |

See **`.env.example`** at the repo root. On Vercel: **Settings → Environment Variables**.

### API response shape (client)

`GET /api/quotes` returns JSON defined in **`src/types/quote-api.ts`**: `ok`, `updatedAt`, `benchmarkTicker`, optional `warning`, and `rows` with **`last`**, **`absChange`**, **`pctReturn`**, **`excessVsBench`**, **`source`** (`live` \| `offline` \| `unavailable`). Raw vendor payloads are not exposed.

## Project structure

```
├── .env.example
├── README.md
├── data/                    # Edit content here (JSON)
│   ├── site.json
│   ├── thesis.json
│   ├── positions.json
│   ├── market.json
│   ├── scenarios.json
│   ├── kpis.json
│   ├── journal.json
│   ├── falsification.json
│   └── footer.json
├── public/                  # Static assets (optional; empty by default)
├── src/
│   ├── app/
│   │   ├── api/quotes/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx         # Single page: all sections
│   ├── components/          # UI blocks
│   ├── lib/
│   │   ├── finnhub.ts       # Server quote + candle fetch
│   │   ├── position-metrics.ts
│   │   └── quote-response.ts
│   └── types/
│       ├── data.ts          # JSON schema for editors
│       └── quote-api.ts     # Public quote API contract
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

## Where to edit content

| File | What to change |
|------|----------------|
| `data/site.json` | Title, subtitle, intro, **launched**, **thesisActive**, **leadPositions**, **leadKpis** |
| `data/thesis.json` | **oneLine**, **coreThesis**, **drivers**, **winners**, **losers**, **whyMatters** |
| `data/positions.json` | Names, tickers, side, sleeve, entry, **offlineQuote**, thesis line, **status** |
| `data/market.json` | **benchmarkTicker**, **pollIntervalSeconds** (60–300) |
| `data/scenarios.json` | **bull** / **base** / **bear** objects: **name**, **description**, **confirmingSignals**, **whatWouldHappen**, **benefits**, **hurt**, **monitorStatus** |
| `data/kpis.json` | **name**, **whyItMatters**, **sourceType** (`manual` \| `api`), **currentStatus**, **interpretation**, **trend** (`up` \| `down` \| `flat` \| `n/a`) |
| `data/journal.json` | Entries: **date**, **title**, **whatChanged**, **implication**, **action**, optional **tags** |
| `data/falsification.json` | **items[]**: **condition**, **detail** |
| `data/footer.json` | **line**, **githubUrl**, **disclaimer** |

**Enums** (must match `src/types/data.ts`): position **status** — `tracking`, `validated`, `under review`, `broken`. Scenario **monitorStatus** — `leading`, `base case`, `monitoring`, `tail risk`.

## If live quotes fail

- Confirm `FINNHUB_API_KEY` in `.env.local` or Vercel.
- Finnhub free tier is **rate-limited**; the UI polls every **60–300s** (see `data/market.json`).
- Partial failures set **`warning`** on the API response and use **`offlineQuote`** where needed.

## Market data behavior

- **Last** and benchmark use Finnhub **quote**; benchmark **history** uses **daily candles** for since-open excess.
- **Excess vs benchmark** = position return since entry minus benchmark return over the same window (not an alpha estimate).
- **429** from Finnhub: one automatic retry; then graceful degradation.

## Deploy to Vercel

1. Import the GitHub repo.
2. Framework **Next.js**, default build command.
3. Set **`FINNHUB_API_KEY`** if you want live marks.

## Disclaimer

Thesis documentation only—not investment advice. See `data/footer.json`.
