# rt3-brobarrel

A static countdown web page for the **Round Table** group's private whiskey barrel ("Bro Barrel"), tracking the 9-year aging journey from April 2024 to April 2034.

## Live site

> Enable GitHub Pages (see below) — URL will be:
> `https://[your-username].github.io/rt3-brobarrel/`

## Features

- Live countdown to maturity (26 April 2034) — years, months, days, hours, minutes, seconds
- Real-time estimated volume with ~2%/year angel's share calculation
- Animated aging progress ring
- Angel's share volume chart (2024–2034, Chart.js)
- At-maturity projections: bottles, shots, pure alcohol
- Dark amber/oak theme, mobile-responsive

## Barrel vitals

| | |
|---|---|
| Barreled | 26 April 2024 |
| Ready | 26 April 2034 |
| Starting volume | 200.55 L @ 63.5 % ABV |
| Annual angel's share | ~2 % |

## GitHub Pages deployment

1. Push the repo to GitHub (`git push origin main`)
2. Open the repo on GitHub → **Settings → Pages**
3. Source: **Deploy from a branch** → branch `main` → folder `/ (root)` → **Save**
4. Visit `https://[your-username].github.io/rt3-brobarrel/` after ~1 minute

Every subsequent push to `main` redeploys automatically — no CI/CD needed.

## Local preview

Open `index.html` directly in a browser. No build step required.

## Project structure

```
index.html        Main page
css/style.css     Dark amber theme
js/app.js         Countdown, angel's share logic, Chart.js
assets/barrel.svg Barrel icon
AGENTS.md         Agentic execution instructions
```