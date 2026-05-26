// ---------------------------------------------------------------------------
// Données — extraites de program.json (18 semaines)
// total = distance hebdo prévue (km) · longRun = distance de la sortie longue (km)
// theme = phase du programme (context.cycleTheme)
// ---------------------------------------------------------------------------

const WEEKS = [
  { index: 1, date: 1780272000000, theme: "VMA", total: 41.95, longRun: 11.8 },
  { index: 2, date: 1780876800000, theme: "VMA", total: 38.37, longRun: 0 },
  { index: 3, date: 1781481600000, theme: "VMA", total: 28.82, longRun: 8.22 },
  { index: 4, date: 1782086400000, theme: "S60", total: 44.89, longRun: 13.77 },
  { index: 5, date: 1782691200000, theme: "S60", total: 46.54, longRun: 14.88 },
  { index: 6, date: 1783296000000, theme: "S60", total: 33.8, longRun: 9.92 },
  { index: 7, date: 1783900800000, theme: "S60", total: 46.14, longRun: 13.85 },
  { index: 8, date: 1784505600000, theme: "S60", total: 48.43, longRun: 14.96 },
  { index: 9, date: 1785110400000, theme: "S60", total: 51.88, longRun: 17.38 },
  { index: 10, date: 1785715200000, theme: "S60", total: 35.02, longRun: 10.86 },
  { index: 11, date: 1786320000000, theme: "Force_A42", total: 58.23, longRun: 18.78 },
  { index: 12, date: 1786924800000, theme: "Force_A42", total: 61.28, longRun: 20.17 },
  { index: 13, date: 1787529600000, theme: "Force_A42", total: 66.43, longRun: 23.67 },
  { index: 14, date: 1788134400000, theme: "Force_A42", total: 44.45, longRun: 15.21 },
  { index: 15, date: 1788739200000, theme: "affutage", total: 63.8, longRun: 27.08 },
  { index: 16, date: 1789344000000, theme: "affutage", total: 57.05, longRun: 19.13 },
  { index: 17, date: 1789948800000, theme: "affutage", total: 44.86, longRun: 12.55 },
  { index: 18, date: 1790553600000, theme: "affutage", total: 58.37, longRun: 0 },
];

const AFFUTAGE = "affutage";

// Ordre + libellés + couleurs des phases (réutilise les zones du design system).
const THEMES = {
  VMA: { label: "Cycle VMA", color: "var(--zone-vma)" },
  S60: { label: "Cycle S60", color: "var(--zone-tempo)" },
  Force_A42: { label: "Force A42", color: "var(--zone-sprint)" },
  affutage: { label: "Affûtage", color: "var(--zone-easy)" },
};

// Une semaine de RÉCUPÉRATION = baisse de volume d'au moins 18 % vs la semaine
// précédente, À L'INTÉRIEUR d'une phase de développement. L'affûtage est une
// phase distincte (réduction programmée avant la course), pas une récup.
const RECOVERY_DROP = 0.18;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmtKm = (v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const fmtPct = (v) => `${v > 0 ? "+" : ""}${Math.round(v * 100)} %`;

function fmtDate(ms) {
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const themeOf = (w) => THEMES[w.theme] || { label: w.theme, color: "var(--zone-tempo)" };

// Enrichit chaque semaine : variation vs précédente, phase, flags récup/affûtage.
const data = WEEKS.map((w, i) => {
  const prev = WEEKS[i - 1];
  const change = prev ? (w.total - prev.total) / prev.total : 0;
  const isAffutage = w.theme === AFFUTAGE;
  return {
    ...w,
    color: themeOf(w).color,
    change,
    isAffutage,
    isRecovery: i > 0 && change <= -RECOVERY_DROP && !isAffutage,
    isRace: isAffutage && w.longRun === 0,
  };
});

const totals = data.map((w) => w.total);
const longRuns = data.map((w) => w.longRun);

// ---------------------------------------------------------------------------
// Statistiques de synthèse
// ---------------------------------------------------------------------------

function renderSummary() {
  const grid = document.querySelector("[data-summary]");
  if (!grid) return;

  const sum = totals.reduce((a, b) => a + b, 0);
  const peak = data.reduce((a, b) => (b.total > a.total ? b : a));
  const peakLong = data.reduce((a, b) => (b.longRun > a.longRun ? b : a));
  const recoveries = data.filter((w) => w.isRecovery);

  const stats = [
    {
      value: `${fmtKm(sum)}<span class="intro-item__unit">km</span>`,
      label: "Volume total du bloc",
      desc: `Cumul des ${data.length} semaines, soit ${fmtKm(sum / data.length)} km/semaine en moyenne.`,
    },
    {
      value: `${fmtKm(peak.total)}<span class="intro-item__unit">km</span>`,
      label: `Pic hebdomadaire · S${peak.index}`,
      desc: `La semaine la plus chargée du programme (${themeOf(peak).label}).`,
    },
    {
      value: `${fmtKm(peakLong.longRun)}<span class="intro-item__unit">km</span>`,
      label: `Sortie longue max · S${peakLong.index}`,
      desc: `Le plus long footing, en ouverture de l'affûtage.`,
    },
    {
      value: `${recoveries.length}`,
      label: "Semaines de récupération",
      desc: `Baisse de volume ≥ ${Math.round(RECOVERY_DROP * 100)} % en phase de développement : S${recoveries
        .map((w) => w.index)
        .join(", S")}.`,
    },
  ];

  grid.replaceChildren(
    ...stats.map((s) => {
      const li = document.createElement("li");
      li.className = "intro-item";
      li.innerHTML = `
        <span class="intro-item__value">${s.value}</span>
        <span class="intro-item__label">${s.label}</span>
        <span class="intro-item__desc">${s.desc}</span>`;
      return li;
    })
  );
}

// ---------------------------------------------------------------------------
// SVG helper
// ---------------------------------------------------------------------------

const SVG_NS = "http://www.w3.org/2000/svg";
const el = (name, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};

// Courbe lissée passant par les points (spline de Catmull-Rom → bézier cubique).
function smoothPath(pts) {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

// Regroupe les semaines en segments contigus de même phase.
function phaseSpans() {
  const spans = [];
  data.forEach((w, i) => {
    const last = spans[spans.length - 1];
    if (last && last.theme === w.theme) last.end = i;
    else spans.push({ theme: w.theme, start: i, end: i });
  });
  return spans;
}

// ---------------------------------------------------------------------------
// Graphique en barres — volume hebdo + part sortie longue + bande de phases
// ---------------------------------------------------------------------------

function renderBarChart() {
  const svg = document.querySelector("[data-bar-chart]");
  if (!svg) return;

  const W = 1000;
  const H = 412;
  const m = { top: 24, right: 16, bottom: 84, left: 44 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const baseY = m.top + plotH;

  const maxY = Math.ceil(Math.max(...totals) / 10) * 10;
  const y = (v) => m.top + plotH * (1 - v / maxY);
  const band = plotW / data.length;
  const barW = band * 0.56;

  // Grille + libellés km
  for (let v = 0; v <= maxY; v += 10) {
    svg.appendChild(
      el("line", { class: "chart__grid-line", x1: m.left, y1: y(v), x2: W - m.right, y2: y(v) })
    );
    const label = el("text", { class: "chart__grid-label", x: m.left - 8, y: y(v) + 4, "text-anchor": "end" });
    label.textContent = v;
    svg.appendChild(label);
  }

  const tooltip = document.querySelector("[data-bar-tooltip]");
  const wrap = svg.closest(".chart");

  data.forEach((w, i) => {
    const cx = m.left + band * i + band / 2;
    const x = cx - barW / 2;

    const group = el("g", {
      class: "chart__bar",
      tabindex: "0",
      role: "button",
      "data-i": i,
      "aria-label": `Semaine ${w.index} : ${fmtKm(w.total)} km au total, sortie longue ${fmtKm(
        w.longRun
      )} km${w.isRecovery ? ", semaine de récupération" : ""}${w.isAffutage ? ", phase d'affûtage" : ""}`,
    });
    group.style.setProperty("--bar-color", w.color);

    group.appendChild(
      el("rect", {
        class: "chart__bar-total",
        x,
        y: y(w.total),
        width: barW,
        height: baseY - y(w.total),
        rx: 4,
        "stroke-dasharray": w.isRecovery ? "5 4" : "none",
      })
    );

    if (w.longRun > 0) {
      group.appendChild(
        el("rect", { class: "chart__bar-long", x, y: y(w.longRun), width: barW, height: baseY - y(w.longRun), rx: 4 })
      );
    }

    // Drapeau récup uniquement (pas affûtage)
    if (w.isRecovery) {
      const flag = el("text", { class: "chart__flag", x: cx, y: y(w.total) - 8, "text-anchor": "middle" });
      flag.textContent = "▼";
      group.appendChild(flag);
    }

    const wl = el("text", { class: "chart__week-label", x: cx, y: baseY + 18, "text-anchor": "middle" });
    wl.textContent = w.index;
    group.appendChild(wl);

    const show = (evt) => {
      tooltip.querySelector("[data-tip-title]").textContent = `Semaine ${w.index} · ${fmtDate(w.date)}`;
      tooltip.querySelector("[data-tip-total]").textContent = `Volume ${fmtKm(w.total)} km`;
      tooltip.querySelector("[data-tip-long]").textContent =
        w.longRun > 0 ? `Sortie longue ${fmtKm(w.longRun)} km` : "Pas de sortie longue";
      const chg = tooltip.querySelector("[data-tip-change]");
      const phase = themeOf(w).label;
      chg.textContent =
        i === 0 ? phase : w.isRecovery ? `Récup · ${fmtPct(w.change)}` : `${phase} · ${fmtPct(w.change)}`;
      chg.classList.toggle("is-down", w.isRecovery);

      const rect = wrap.getBoundingClientRect();
      const target = evt.currentTarget.getBoundingClientRect();
      tooltip.style.left = `${target.left + target.width / 2 - rect.left}px`;
      tooltip.style.top = `${target.top - rect.top - 6}px`;
      tooltip.hidden = false;
    };
    const hide = () => (tooltip.hidden = true);
    group.addEventListener("mouseenter", show);
    group.addEventListener("focus", show);
    group.addEventListener("mouseleave", hide);
    group.addEventListener("blur", hide);

    svg.appendChild(group);
  });

  // Bande de phases sous l'axe
  const bandY = baseY + 34;
  phaseSpans().forEach((sp) => {
    const xa = m.left + band * sp.start + 3;
    const xb = m.left + band * (sp.end + 1) - 3;
    const t = themeOf({ theme: sp.theme });
    svg.appendChild(
      el("rect", { class: "chart__phase-bar", x: xa, y: bandY, width: xb - xa, height: 5, rx: 2.5, fill: t.color })
    );
    const label = el("text", { class: "chart__phase-label", x: (xa + xb) / 2, y: bandY + 20, "text-anchor": "middle", fill: t.color });
    label.textContent = t.label;
    svg.appendChild(label);
  });
}

// ---------------------------------------------------------------------------
// Graphique en ligne — progression des sorties longues
// ---------------------------------------------------------------------------

function renderLongRunChart() {
  const svg = document.querySelector("[data-long-chart]");
  if (!svg) return;

  const W = 1000;
  const H = 300;
  const m = { top: 24, right: 16, bottom: 52, left: 44 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const maxY = Math.ceil(Math.max(...longRuns) / 5) * 5;
  const y = (v) => m.top + plotH * (1 - v / maxY);
  const band = plotW / data.length;
  const cxOf = (i) => m.left + band * i + band / 2;

  for (let v = 0; v <= maxY; v += 5) {
    svg.appendChild(el("line", { class: "chart__grid-line", x1: m.left, y1: y(v), x2: W - m.right, y2: y(v) }));
    const label = el("text", { class: "chart__grid-label", x: m.left - 8, y: y(v) + 4, "text-anchor": "end" });
    label.textContent = v;
    svg.appendChild(label);
  }

  const pts = data.map((w, i) => ({ w, i })).filter(({ w }) => w.longRun > 0);
  const coords = pts.map(({ w, i }) => ({ x: cxOf(i), y: y(w.longRun) }));
  svg.appendChild(el("path", { class: "chart__line", d: smoothPath(coords) }));

  const tooltip = document.querySelector("[data-long-tooltip]");
  const wrap = svg.closest(".chart");

  data.forEach((w, i) => {
    const wl = el("text", { class: "chart__week-label", x: cxOf(i), y: H - m.bottom + 18, "text-anchor": "middle" });
    wl.textContent = w.index;
    svg.appendChild(wl);

    if (w.longRun <= 0) return;

    const dot = el("circle", {
      class: "chart__dot",
      cx: cxOf(i),
      cy: y(w.longRun),
      r: 5,
      tabindex: "0",
      role: "button",
      "data-i": i,
      "aria-label": `Semaine ${w.index} : sortie longue ${fmtKm(w.longRun)} km`,
    });
    dot.style.setProperty("--bar-color", w.color);

    const show = (evt) => {
      tooltip.querySelector("[data-tip-title]").textContent = `Semaine ${w.index} · ${fmtDate(w.date)}`;
      tooltip.querySelector("[data-tip-long]").textContent = `Sortie longue ${fmtKm(w.longRun)} km`;
      const sub = tooltip.querySelector("[data-tip-sub]");
      sub.textContent = w.isRecovery ? "Semaine de récupération" : themeOf(w).label;
      sub.classList.toggle("is-down", w.isRecovery);

      const rect = wrap.getBoundingClientRect();
      const target = evt.currentTarget.getBoundingClientRect();
      tooltip.style.left = `${target.left + target.width / 2 - rect.left}px`;
      tooltip.style.top = `${target.top - rect.top - 6}px`;
      tooltip.hidden = false;
    };
    const hide = () => (tooltip.hidden = true);
    dot.addEventListener("mouseenter", show);
    dot.addEventListener("focus", show);
    dot.addEventListener("mouseleave", hide);
    dot.addEventListener("blur", hide);

    svg.appendChild(dot);
  });
}

// ---------------------------------------------------------------------------
// Listes de tuiles (récup + affûtage)
// ---------------------------------------------------------------------------

function tile({ value, valueClass = "", label, desc, color }) {
  const li = document.createElement("li");
  li.className = "intro-item";
  if (color) li.style.setProperty("--card-color", color);
  li.innerHTML = `
    <span class="intro-item__value ${valueClass}">${value}</span>
    <span class="intro-item__label">${label}</span>
    <span class="intro-item__desc">${desc}</span>`;
  return li;
}

function renderRecovery() {
  const grid = document.querySelector("[data-recovery]");
  if (!grid) return;

  const recoveries = data.filter((w) => w.isRecovery);
  grid.replaceChildren(
    ...recoveries.map((w) => {
      const prev = data[data.indexOf(w) - 1];
      return tile({
        value: fmtPct(w.change),
        valueClass: "chart__down",
        color: w.color,
        label: `Semaine ${w.index} · ${themeOf(w).label}`,
        desc: `Volume ${fmtKm(prev.total)} → <strong>${fmtKm(w.total)} km</strong>. Sortie longue ramenée à ${fmtKm(
          w.longRun
        )} km.`,
      });
    })
  );
}

function renderAffutage() {
  const grid = document.querySelector("[data-affutage]");
  if (!grid) return;

  const weeks = data.filter((w) => w.isAffutage);
  grid.replaceChildren(
    ...weeks.map((w) => {
      let desc;
      if (w.isRace) {
        desc = `Semaine de course — pas de sortie longue, volume d'entretien avant le départ.`;
      } else {
        const chg = w.change < 0 ? `volume ${fmtPct(w.change)} vs S${w.index - 1}` : `ouverture de l'affûtage`;
        desc = `Sortie longue ${fmtKm(w.longRun)} km · ${chg}.`;
      }
      return tile({
        value: `${fmtKm(w.total)}<span class="intro-item__unit">km</span>`,
        color: w.color,
        label: `Semaine ${w.index}${w.isRace ? " · course" : ""}`,
        desc,
      });
    })
  );
}

// ---------------------------------------------------------------------------
// Légende des phases
// ---------------------------------------------------------------------------

function renderLegend() {
  document.querySelectorAll("[data-legend]").forEach((legend) => {
    legend.replaceChildren(
      ...Object.values(THEMES).map((t) => {
        const span = document.createElement("span");
        span.className = "chart__legend-item";
        span.innerHTML = `<span class="chart__legend-dot" style="background:${t.color}"></span>${t.label}`;
        return span;
      })
    );
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderBarChart();
  renderLongRunChart();
  renderRecovery();
  renderAffutage();
  renderLegend();
});
