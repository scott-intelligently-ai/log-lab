# LogLab — Interactive Logarithm Tutor

A web app that helps 10th-grade students master logarithms through visual math input, step-by-step explanations, and progressive practice problems across 7 levels.

## Features

- **Visual Math Input** — MathLive editor lets students enter expressions in proper math notation (no typing "log base 2 of 8")
- **Quick-insert toolbar** — One-click buttons for log_b(), log(), ln(), exponents, fractions
- **Step-by-Step Explanations** — Every problem gets a clear, educational walkthrough with inline rendered math
- **7 Progressive Levels** — From basic definitions through change of base, with free navigation between levels
- **Practice Mode** — Randomly generated problems for each level with answer checking
- **Ask Your Own** — Enter any logarithm expression and get it explained
- **Beautiful Math Rendering** — KaTeX renders all math as properly typeset formulas

## Levels

1. **Understanding Logarithms** — definitions, converting between forms
2. **Common & Natural Logs** — log (base 10) and ln (base e)
3. **Properties of Logarithms** — product, quotient, and power rules
4. **Expanding Expressions** — breaking complex logs into simpler terms
5. **Condensing Expressions** — combining log terms into a single logarithm
6. **Solving Equations** — finding unknowns in logarithmic/exponential equations
7. **Change of Base** — converting between arbitrary bases

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MathLive** — visual math editor web component
- **KaTeX** — fast math typesetting

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The easiest deployment path:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — click Deploy

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) and create a new project from your repo
3. Railway will detect Next.js and deploy automatically

Or use the Railway CLI:

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```
