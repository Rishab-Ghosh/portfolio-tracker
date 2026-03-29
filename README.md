# Live Thesis Tracker

A minimal, finance-style **Next.js** companion page for a five-year investment thesis on the U.S. transition to autonomous vehicles. It presents the thesis, positions, KPIs, scenarios, a dated journal, and explicit falsification conditions—intended to read like an investor’s monitoring memo, not a trading toy.

- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4  
- **Data:** JSON files under `data/` (no database or APIs)  
- **Deploy:** Ready for [Vercel](https://vercel.com) (default Next.js preset)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
npm start
```

## Edit thesis content

All copy and structured content lives in **`data/`**:

| File | Purpose |
|------|---------|
| `site.json` | Page title, subtitle, intro paragraph |
| `thesis.json` | Core thesis paragraph and driver bullets |
| `positions.json` | Securities table (ticker, side, prices, status, summary) |
| `kpis.json` | KPI monitor rows |
| `scenarios.json` | Bull / base / bear columns |
| `journal.json` | Dated thesis journal entries (newest-first on the page) |
| `falsification.json` | “What would prove me wrong” items |
| `footer.json` | Footer line, GitHub URL, disclaimer |

After editing JSON, save the file; the dev server will hot-reload. `status` on positions must be one of: `tracking`, `validated`, `under review`, `broken`. `side` is `long` or `short`.

**GitHub link:** set `githubUrl` in `data/footer.json` to your repository.

## UI structure (code)

- **`src/app/page.tsx`** — Composes sections; imports JSON via the `@data/*` alias.
- **`src/components/`** — Reusable section shells and blocks (`Section`, `Hero`, `PositionTracker`, etc.).
- **`src/types/data.ts`** — TypeScript shapes aligned with the JSON (for reference and consistency).

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel: **Add New Project** → import the repo.
3. Framework preset **Next.js**, root directory the repo root, build command `npm run build`, output default.
4. Deploy. No environment variables are required for the static JSON setup.

## Disclaimer

This repository is a **monitoring and presentation framework** only. It is not investment advice.
