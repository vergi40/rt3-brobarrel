# RT3 Bro Barrel — Project Definition

> Execution instructions for an agentic coding session.
> Point an agent at this file and ask it to implement the project.

---

## Goal

Build a static countdown web page for the Round Table group's whiskey barrel aging investment ("Bro Barrel").
The page requires no server, no build tools, no npm, and no framework.
It is deployed via GitHub Pages from the `main` branch root.

---

## Repository structure to create

```
index.html
css/style.css
js/app.js
assets/barrel.svg
```

---

## Barrel constants (hard-code in `js/app.js` as named constants)

```js
const BARREL = {
  name: "Bro Barrel",
  group: "Round Table",
  filledDate: new Date("2024-04-26T00:00:00"),
  readyDate:  new Date("2034-04-26T00:00:00"),
  startVolumeLiters: 200.55,
  abvFill: 0.635,          // 63.5%
  annualLossRate: 0.02,    // ~2% angel's share per year
  bottleSizeMl: 700,
  shotSizeMl: 40,
};
```

---

## Computed values (derive in JS — do NOT hard-code)

| Variable | Formula |
|---|---|
| `daysElapsed` | `(now - filledDate) / 86400000` |
| `daysRemaining` | `(readyDate - now) / 86400000` |
| `totalDays` | `(readyDate - filledDate) / 86400000` |
| `progressPct` | `daysElapsed / totalDays * 100` |
| `currentVolume` | `startVolumeLiters × (1 − annualLossRate)^(daysElapsed/365)` |
| `angelShareLost` | `startVolumeLiters − currentVolume` |
| `projectedFinalVolume` | `startVolumeLiters × (1 − annualLossRate)^9` ≈ 167.2 L |
| `projectedBottles` | `floor(projectedFinalVolume × 1000 / bottleSizeMl)` ≈ 239 |
| `projectedShots` | `floor(projectedFinalVolume × 1000 / shotSizeMl)` ≈ 4180 |
| `projectedPureAlcohol` | `projectedFinalVolume × abvFill` ≈ 106.2 L |

---

## Page sections (in order)

### 1. Hero
- Barrel SVG icon (`assets/barrel.svg`)
- Page title: **Bro Barrel**
- Subtitle: *Round Table — Private Cask*
- Badge pill: "Barreled 26 April 2024"

### 2. Live countdown
- Update every 1 second via `setInterval`
- Display units: **Years : Months : Days : Hrs : Min : Sec**
- Use calendar-accurate year/month decomposition (not just total seconds)
- On/after `readyDate`: hide countdown, show celebration message

### 3. Progress ring
- SVG circle with `stroke-dasharray` / `stroke-dashoffset`
- Animate from 0 → `progressPct` on page load (CSS transition)
- Label in ring center: "X.X% aged"

### 4. Stats cards (4 cards, responsive grid)
| Card | Value |
|---|---|
| Volume today | `currentVolume.toFixed(2) + " L"` |
| Angel's share taken | `angelShareLost.toFixed(2) + " L"` |
| Days aged | integer days, `toLocaleString()` |
| Days remaining | integer days, `toLocaleString()` |

### 5. Angel's share chart (Chart.js)
- Load Chart.js from CDN: `https://cdn.jsdelivr.net/npm/chart.js`
- Line chart, x-axis: monthly data points from filledDate → readyDate (109 points)
- y-axis: volume in liters, min 155, max 205
- Gradient fill under curve (amber/gold)
- Custom inline plugin: vertical dashed line + "Today" label at the current month index
- Tooltip shows month/year + volume

### 6. Barrel vitals table

| Field | Value |
|---|---|
| Barreled | 26 April 2024 |
| Expected maturity | 26 April 2034 |
| Starting volume | 200.55 L |
| ABV at fill | 63.5 % |
| Annual angel's share | ~2 % |
| Cask type | — |
| Distillery | — |

### 7. At maturity projections (4 cards)
- Projected volume (L)
- Bottles (70 cl)
- Shots (4 cl)
- Pure alcohol (L)

### 8. Footer
- "Round Table — est. 2024"
- "This barrel is still sleeping. Check back in X days."

---

## Visual design

### CSS variables
```css
:root {
  --bg:        #120800;
  --surface:   #1f1008;
  --gold:      #c8963e;
  --gold-light:#e8b55a;
  --text:      #f0e6d3;
  --muted:     #8a7060;
  --border:    #3a2010;
}
```

### Fonts (Google Fonts CDN)
- Headings: `Cinzel` (serif)
- Body: `Lato` (sans-serif, weight 300/400/700)
- Countdown digits: `Space Mono` (monospace)

### Layout
- Max-width 900px, centered
- Responsive: single-column on mobile, multi-column cards on ≥ 600px
- No external CSS framework

---

## `assets/barrel.svg`

Simple SVG barrel, front view (bulging silhouette), with:
- Bezier barrel body path
- 3 vertical stave lines (clipped to barrel shape)
- 3 metal hoops (ellipses at top, middle, bottom)
- Top and bottom end caps (ellipses)
- Bung hole dot at center
- Color palette: `#2a1510` fill, `#c8963e` strokes, `#e8b55a` bung accent

---

## GitHub Pages deployment (document in `README.md`)

1. `git push` to `main`
2. Repo **Settings → Pages** → Source: `main` branch, `/ (root)` folder → Save
3. URL: `https://[username].github.io/rt3-brobarrel/`

---

## Quality requirements

- No dependencies except Chart.js + Google Fonts (CDN only)
- Valid HTML5 (`<!DOCTYPE html>`)
- Works in latest Chrome, Firefox, Safari, Edge
- Mobile-responsive (no horizontal scroll on 375px viewport)
- All countdown/stats values update via JS; static fallback content in HTML is acceptable
