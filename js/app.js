// ---------------------------------------------------------------
//  Barrel constants
// ---------------------------------------------------------------
const BARREL = {
  name: "Bro Barrel",
  group: "Round Table",
  filledDate: new Date("2024-04-26T00:00:00"),
  readyDate:  new Date("2034-04-26T00:00:00"),
  startVolumeLiters: 200.55,
  abvFill: 0.635,          // 63.5 %
  annualLossRate: 0.02,    // ~2 % angel's share per year
  bottleSizeMl: 700,
  shotSizeMl: 40,
};

// ---------------------------------------------------------------
//  Static projections (computed once at load)
// ---------------------------------------------------------------
const TOTAL_DAYS = (BARREL.readyDate - BARREL.filledDate) / 86400000;
const YEARS_TOTAL = 9;

const projectedFinalVolume = BARREL.startVolumeLiters * Math.pow(1 - BARREL.annualLossRate, YEARS_TOTAL);
const projectedBottles     = Math.floor(projectedFinalVolume * 1000 / BARREL.bottleSizeMl);
const projectedShots       = Math.floor(projectedFinalVolume * 1000 / BARREL.shotSizeMl);
const projectedPureAlcohol = projectedFinalVolume * BARREL.abvFill;

document.getElementById("proj-volume").textContent  = `~${projectedFinalVolume.toFixed(1)} L`;
document.getElementById("proj-bottles").textContent = `~${projectedBottles.toLocaleString()}`;
document.getElementById("proj-shots").textContent   = `~${projectedShots.toLocaleString()}`;
document.getElementById("proj-alcohol").textContent = `~${projectedPureAlcohol.toFixed(1)} L`;

// ---------------------------------------------------------------
//  Calendar-accurate countdown
// ---------------------------------------------------------------
function calcCountdown(from, to) {
  if (to <= from) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  let y  = to.getFullYear()  - from.getFullYear();
  let mo = to.getMonth()     - from.getMonth();
  let d  = to.getDate()      - from.getDate();
  let h  = to.getHours()     - from.getHours();
  let mi = to.getMinutes()   - from.getMinutes();
  let s  = to.getSeconds()   - from.getSeconds();

  if (s  < 0) { s  += 60; mi -= 1; }
  if (mi < 0) { mi += 60; h  -= 1; }
  if (h  < 0) { h  += 24; d  -= 1; }
  if (d  < 0) {
    // Borrow days from the previous month of 'to'
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    d  += prevMonth.getDate();
    mo -= 1;
  }
  if (mo < 0) { mo += 12; y -= 1; }

  return { years: y, months: mo, days: d, hours: h, minutes: mi, seconds: s, done: false };
}

// ---------------------------------------------------------------
//  Progress ring
// ---------------------------------------------------------------
const ringFill = document.getElementById("ring-fill");
const RING_R = 88;
const RING_CIRC = 2 * Math.PI * RING_R;

ringFill.style.strokeDasharray  = RING_CIRC;
ringFill.style.strokeDashoffset = RING_CIRC; // start empty

function setRing(pct) {
  const clamped = Math.min(100, Math.max(0, pct));
  ringFill.style.strokeDashoffset = RING_CIRC - (clamped / 100) * RING_CIRC;
}

// ---------------------------------------------------------------
//  Live tick — updates countdown, ring, and stats cards
// ---------------------------------------------------------------
function pad2(n) { return String(n).padStart(2, "0"); }

function tick() {
  const now = new Date();
  const daysElapsed   = (now - BARREL.filledDate) / 86400000;
  const daysRemaining = (BARREL.readyDate - now)  / 86400000;
  const progressPct   = Math.min(100, (daysElapsed / TOTAL_DAYS) * 100);
  const currentVolume  = BARREL.startVolumeLiters * Math.pow(1 - BARREL.annualLossRate, daysElapsed / 365);
  const angelShareLost = BARREL.startVolumeLiters - currentVolume;

  // Stats cards
  document.getElementById("stat-volume").textContent   = currentVolume.toFixed(2);
  document.getElementById("stat-angel").textContent    = angelShareLost.toFixed(2);
  document.getElementById("stat-daysaged").textContent = Math.floor(daysElapsed).toLocaleString();
  document.getElementById("stat-daysrem").textContent  = Math.max(0, Math.floor(daysRemaining)).toLocaleString();
  document.getElementById("footer-days").textContent   = Math.max(0, Math.floor(daysRemaining)).toLocaleString();

  // Progress ring
  setRing(progressPct);
  document.getElementById("ring-pct").textContent = progressPct.toFixed(1) + "%";

  // Countdown
  const cd = calcCountdown(now, BARREL.readyDate);
  if (cd.done) {
    document.getElementById("countdown").style.display    = "none";
    document.getElementById("matured-msg").style.display  = "block";
    document.getElementById("footer-sleep").style.display = "none";
  } else {
    document.getElementById("cd-years").textContent   = cd.years;
    document.getElementById("cd-months").textContent  = cd.months;
    document.getElementById("cd-days").textContent    = cd.days;
    document.getElementById("cd-hours").textContent   = pad2(cd.hours);
    document.getElementById("cd-minutes").textContent = pad2(cd.minutes);
    document.getElementById("cd-seconds").textContent = pad2(cd.seconds);
  }
}

tick();
setInterval(tick, 1000);

// ---------------------------------------------------------------
//  Angel's share chart (Chart.js)
// ---------------------------------------------------------------
(function buildChart() {
  const labels  = [];
  const volumes = [];

  // Monthly data points: 9 years × 12 + 1 = 109 points
  for (let m = 0; m <= 108; m++) {
    const date = new Date(BARREL.filledDate.getFullYear(), BARREL.filledDate.getMonth() + m, 1);
    const daysFromFill = (date - BARREL.filledDate) / 86400000;
    const vol = BARREL.startVolumeLiters * Math.pow(1 - BARREL.annualLossRate, daysFromFill / 365);
    labels.push(date.toLocaleDateString("en-GB", { year: "numeric", month: "short" }));
    volumes.push(parseFloat(vol.toFixed(2)));
  }

  // Index of the last month that is <= today
  const now = new Date();
  let todayIdx = 0;
  for (let i = 0; i < 109; i++) {
    const d = new Date(BARREL.filledDate.getFullYear(), BARREL.filledDate.getMonth() + i, 1);
    if (d <= now) todayIdx = i;
    else break;
  }

  const ctx = document.getElementById("angels-chart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, "rgba(200, 150, 62, 0.55)");
  gradient.addColorStop(1, "rgba(200, 150, 62, 0.03)");

  // Inline plugin: vertical "Today" line
  const todayLinePlugin = {
    id: "todayLine",
    afterDraw(chart) {
      const { ctx: c, scales: { x, y } } = chart;
      const xPos = x.getPixelForValue(todayIdx);
      c.save();
      c.beginPath();
      c.moveTo(xPos, y.top);
      c.lineTo(xPos, y.bottom);
      c.strokeStyle = "#e8b55a";
      c.lineWidth = 1.5;
      c.setLineDash([5, 4]);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = "#e8b55a";
      c.font = "bold 11px Lato, sans-serif";
      c.textAlign = "center";
      c.fillText("Today", xPos, y.top - 6);
      c.restore();
    },
  };

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Volume (L)",
        data: volumes,
        borderColor: "#c8963e",
        borderWidth: 2,
        fill: true,
        backgroundColor: gradient,
        pointRadius: 0,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          ticks: {
            color: "#8a7060",
            maxTicksLimit: 10,
            font: { family: "Lato, sans-serif", size: 11 },
          },
          grid: { color: "rgba(58,32,16,0.7)" },
        },
        y: {
          min: 155,
          max: 205,
          ticks: {
            color: "#8a7060",
            font: { family: "Lato, sans-serif", size: 11 },
            callback: v => v + " L",
          },
          grid: { color: "rgba(58,32,16,0.7)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1f1008",
          borderColor: "#c8963e",
          borderWidth: 1,
          titleColor: "#e8b55a",
          bodyColor: "#f0e6d3",
          callbacks: {
            label: item => `Volume: ${item.parsed.y} L`,
          },
        },
      },
    },
    plugins: [todayLinePlugin],
  });
})();
