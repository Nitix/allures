// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PACES = [
  { slug: "slow", value: 650.0981393774688, dvalue: 40, abstract: true, competitive: false },
  { slug: "moderate", value: 273.5458643550155, dvalue: 12.738018998628453, abstract: true, competitive: false },
  { slug: "fast", value: 205.45916134124832, dvalue: 6.246283220150738, abstract: true, competitive: false },
  { slug: "sprint", value: 164.02172905969422, dvalue: 3.5746469560858785, abstract: true, competitive: false },
  { slug: "ef", value: 353.260058843394, dvalue: 22.110417551593613, abstract: false, competitive: false },
  { slug: "tempo", value: 322.6854718240411, dvalue: 18.337926883466146, abstract: false, competitive: false },
  { slug: "sweet-spot", value: 288.1804562000476, dvalue: 14.339873457427405, abstract: false, competitive: false },
  { slug: "aerobie", value: 342.65279485191843, dvalue: 20.77892806783297, abstract: false, competitive: false },
  { slug: "seuil60", value: 273.5458643550155, dvalue: 12.738018998628453, abstract: false, competitive: false },
  { slug: "seuil30", value: 259.6544571148478, dvalue: 11.27558822713353, abstract: false, competitive: false },
  { slug: "vma", value: 226.92731826039264, dvalue: 8.089764740219197, abstract: false, competitive: false },
  { slug: "marathon", value: 312.5178219321211, dvalue: 15.859053078349017, abstract: false, competitive: true },
  { slug: "half-marathon", value: 284.2456881881261, dvalue: 13.903318420139152, abstract: false, competitive: true },
  { slug: "10km", value: 267.50565393428394, dvalue: 12.094873257667548, abstract: false, competitive: true },
  { slug: "5km", value: 252.8473197080575, dvalue: 10.581276244414997, abstract: false, competitive: true },
  { slug: "1500m", value: 229.2697706332543, dvalue: 8.30404943778259, abstract: false, competitive: true },
  { slug: "endurance-confort", value: 367.0923125546691, dvalue: 23.88106360005505, abstract: true, competitive: false },
  { slug: "endurance-fondamentale", value: 353.260058843394, dvalue: 22.110417551593613, abstract: true, competitive: false },
  { slug: "endurance-active", value: 342.65279485191843, dvalue: 20.77892806783297, abstract: true, competitive: false },
  { slug: "vo2max", value: 226.92731826039264, dvalue: 8.089764740219197, abstract: true, competitive: false },
];

const META = {
  slow: {
    label: "Footing très lent",
    description:
      "Très en-dessous de l'endurance fondamentale — récupération ou retour au calme.",
    tag: "Récup",
  },
  fast: {
    label: "Allure rapide",
    description:
      "Entre la VMA et le sprint, sans cadre formel — utile pour les accélérations courtes.",
    tag: "Rapide",
  },
  sprint: {
    label: "Sprint",
    description: "Effort maximal sur quelques dizaines de secondes.",
    tag: "Max",
  },
  ef: {
    label: "Endurance fondamentale",
    description: "Base aérobie, cœur de l'entraînement — 70 % du volume.",
    tag: "EF",
  },
  tempo: {
    label: "Tempo",
    description: "Allure soutenue, respiration ample mais maîtrisée.",
    tag: "Tempo",
  },
  "sweet-spot": {
    label: "Sweet-spot",
    description: "Entre tempo et seuil — fort rendement aérobie.",
    tag: "Sweet-spot",
  },
  aerobie: {
    label: "Aérobie",
    description: "Travail aérobie strict, juste au-dessus de l'EF.",
    tag: "Aérobie",
  },
  seuil60: {
    label: "Seuil 60 min",
    description: "Soutenable environ 1 h, juste sous le seuil lactique.",
    tag: "Seuil",
  },
  seuil30: {
    label: "Seuil 30 min",
    description: "Allure de seuil lactique, tenable ~30 min en course.",
    tag: "Seuil",
  },
  vma: {
    label: "VMA",
    description: "Vitesse maximale aérobie — intervalles courts.",
    tag: "VMA",
  },
  marathon: {
    label: "Marathon",
    description: "42,195 km — gestion du glycogène et régularité.",
    distance: 42.195,
    tag: "42,2 km",
  },
  "half-marathon": {
    label: "Semi-marathon",
    description: "21,1 km — équilibre entre allure et endurance.",
    distance: 21.0975,
    tag: "21,1 km",
  },
  "10km": {
    label: "10 km",
    description: "Allure soutenue autour de 35–45 minutes.",
    distance: 10,
    tag: "10 km",
  },
  "5km": {
    label: "5 km",
    description: "Effort intense, proche du seuil supérieur.",
    distance: 5,
    tag: "5 km",
  },
  "1500m": {
    label: "1500 m",
    description: "Course rapide, très proche de la VMA.",
    distance: 1.5,
    tag: "1,5 km",
  },
  "endurance-confort": {
    label: "Endurance confort",
    description:
      "Footing très tranquille, juste sous l'endurance fondamentale.",
    tag: "Confort",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** seconds per km → "5:12" */
function secToMinKm(sec) {
  const total = Math.round(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** seconds per km → km/h with 1 decimal */
function secToKmh(sec) {
  return (3600 / sec).toFixed(1);
}

/** total seconds → "42:13" or "3h05:42" */
function formatRaceTime(totalSeconds) {
  const total = Math.round(totalSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}h${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function secPerKmToRaceTime(secPerKm, distanceKm) {
  return formatRaceTime(secPerKm * distanceKm);
}

/** Returns the pace range as { fast, slow } in "min:ss" format. */
function paceRange(value, dvalue) {
  return {
    fast: secToMinKm(value - dvalue),
    slow: secToMinKm(value + dvalue),
  };
}

/** Returns the speed range as { min, max } in km/h (1 decimal). */
function speedRange(value, dvalue) {
  return {
    min: (3600 / (value + dvalue)).toFixed(1),
    max: (3600 / (value - dvalue)).toFixed(1),
  };
}

/** Map pace (sec/km) to a zone color CSS variable. */
function zoneColor(secPerKm) {
  if (secPerKm > 330) return "var(--zone-easy)";
  if (secPerKm > 280) return "var(--zone-tempo)";
  if (secPerKm > 240) return "var(--zone-threshold)";
  if (secPerKm > 200) return "var(--zone-vma)";
  return "var(--zone-sprint)";
}

function categoryOf(pace) {
  if (pace.competitive) return "competition";
  return "training";
}

// ---------------------------------------------------------------------------
// Enrichment
// ---------------------------------------------------------------------------

// Drop abstract entries that duplicate a non-abstract zone with the same value
// (e.g. "moderate" = "seuil60", "vo2max" = "vma"). They add noise without info.
const technicalValues = new Set(
  PACES.filter((p) => !p.abstract).map((p) => p.value)
);
const filtered = PACES.filter(
  (p) => !p.abstract || !technicalValues.has(p.value)
);

const enriched = filtered.map((p) => {
  const meta = META[p.slug] || { label: p.slug, description: "", tag: p.slug };
  const range = paceRange(p.value, p.dvalue);
  const speed = speedRange(p.value, p.dvalue);
  return {
    ...p,
    ...meta,
    pace: secToMinKm(p.value),
    kmh: secToKmh(p.value),
    paceFast: range.fast,
    paceSlow: range.slow,
    kmhMin: speed.min,
    kmhMax: speed.max,
    color: zoneColor(p.value),
    category: categoryOf(p),
  };
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function createCard(pace) {
  const card = document.createElement("article");
  card.className = "card";
  card.id = `pace-${pace.slug}`;
  card.style.setProperty("--card-color", pace.color);

  const showRace = pace.competitive && pace.distance;
  const raceBlock = showRace
    ? `
      <div class="card__race">
        <span class="card__race-label">Temps de course</span>
        <strong class="card__race-value">${secPerKmToRaceTime(
          pace.value,
          pace.distance
        )}</strong>
        <span class="card__race-range">
          ${secPerKmToRaceTime(pace.value - pace.dvalue, pace.distance)}
          <span class="card__race-sep">→</span>
          ${secPerKmToRaceTime(pace.value + pace.dvalue, pace.distance)}
        </span>
      </div>`
    : "";

  card.innerHTML = `
    <span class="card__zone-bar" aria-hidden="true"></span>
    <header class="card__head">
      <h3 class="card__name">${pace.label}</h3>
      <span class="card__tag">${pace.tag}</span>
    </header>
    <div class="card__pace">
      ${pace.pace}<span class="card__pace-unit">min/km</span>
    </div>
    <div class="card__range" aria-label="Plage d'allure">
      <span class="card__range-dot" aria-hidden="true"></span>
      <span class="card__range-value">${pace.paceFast}</span>
      <span class="card__range-sep">→</span>
      <span class="card__range-value">${pace.paceSlow}</span>
      <span class="card__range-unit">/km</span>
    </div>
    <div class="card__meta">
      <div class="card__meta-item">
        <span class="card__meta-label">Vitesse</span>
        <span class="card__meta-value">${pace.kmh} km/h</span>
      </div>
      <div class="card__meta-item">
        <span class="card__meta-label">Plage km/h</span>
        <span class="card__meta-value">${pace.kmhMin} – ${pace.kmhMax}</span>
      </div>
    </div>
    ${raceBlock}
    ${pace.description ? `<p class="card__description">${pace.description}</p>` : ""}
  `;

  return card;
}

const competitionPaces = enriched
  .filter((p) => p.category === "competition")
  .sort((a, b) => a.value - b.value); // shortest distance first
const trainingPaces = enriched
  .filter((p) => p.category === "training")
  .sort((a, b) => b.value - a.value); // slowest pace first

function renderCompetition() {
  const grid = document.querySelector('[data-grid="competition"]');
  grid.replaceChildren(...competitionPaces.map(createCard));
}

function renderTraining({ includeCompetition }) {
  const grid = document.querySelector('[data-grid="training"]');
  const list = includeCompetition
    ? [...trainingPaces, ...competitionPaces].sort((a, b) => b.value - a.value)
    : trainingPaces;
  grid.replaceChildren(
    ...list.map((p) => {
      const card = createCard(p);
      // Competition cards keep their canonical id in the competition section,
      // so strip it here to avoid duplicate ids in the DOM.
      if (p.category === "competition") card.removeAttribute("id");
      return card;
    })
  );
}

function setupCompetitionToggle() {
  const button = document.querySelector("[data-toggle-comp]");

  const apply = (on) => {
    button.setAttribute("aria-pressed", String(on));
    renderTraining({ includeCompetition: on });
  };

  button.addEventListener("click", () => {
    const on = button.getAttribute("aria-pressed") !== "true";
    apply(on);
  });

  apply(false);
}

function renderDate() {
  const node = document.querySelector("[data-today]");
  if (!node) return;
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const formatted = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  node.setAttribute("datetime", iso);
  node.textContent = formatted;
}

// ---------------------------------------------------------------------------
// Spectrum (SVG)
// ---------------------------------------------------------------------------

function renderSpectrum() {
  const group = document.querySelector("[data-points]");
  const tooltip = document.querySelector(".spectrum__tooltip");
  const spectrumEl = document.querySelector(".spectrum");

  // Linear km/h axis. Include range edges so segments stay on-canvas.
  const allSpeeds = enriched.flatMap((p) => [
    3600 / (p.value + p.dvalue),
    3600 / (p.value - p.dvalue),
  ]);
  const minSpeed = Math.min(...allSpeeds) - 0.4;
  const maxSpeed = Math.max(...allSpeeds) + 0.4;

  const x0 = 40;
  const x1 = 960;
  const speedToX = (s) =>
    x0 + ((s - minSpeed) / (maxSpeed - minSpeed)) * (x1 - x0);

  // Build segments and assign each to a non-overlapping lane.
  const segments = enriched.map((p) => {
    const xCenter = speedToX(3600 / p.value);
    const xFastEnd = speedToX(3600 / (p.value - p.dvalue));
    const xSlowEnd = speedToX(3600 / (p.value + p.dvalue));
    return { p, xCenter, xLeft: xSlowEnd, xRight: xFastEnd };
  });

  // Lanes alternate around the axis: 0 = on axis, then +1, -1, +2, -2, +3, -3.
  // The order we try them in is: axis first (visual emphasis), then nearest.
  const LANE_Y = [80, 60, 100, 42, 118, 26, 134];
  const LANE_GAP = 6; // px between segments in the same lane

  // Sort by left edge to make greedy lane assignment work
  segments.sort((a, b) => a.xLeft - b.xLeft);
  const laneRight = new Array(LANE_Y.length).fill(-Infinity);

  segments.forEach((seg) => {
    let lane = -1;
    for (let i = 0; i < LANE_Y.length; i++) {
      if (laneRight[i] + LANE_GAP <= seg.xLeft) {
        lane = i;
        break;
      }
    }
    if (lane === -1) lane = LANE_Y.length - 1;
    laneRight[lane] = seg.xRight;
    seg.y = LANE_Y[lane];
  });

  segments.forEach(({ p, xCenter, xLeft, xRight, y }) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
    node.setAttribute("class", "spectrum__point");
    node.setAttribute("tabindex", "0");
    node.setAttribute("data-slug", p.slug);
    node.setAttribute("role", "button");
    node.setAttribute(
      "aria-label",
      `${p.label} : ${p.pace} min/km (${p.paceFast} à ${p.paceSlow}), ${p.kmh} km/h`
    );

    const range = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    range.setAttribute("x", xLeft);
    range.setAttribute("y", y - 3);
    range.setAttribute("width", Math.max(2, xRight - xLeft));
    range.setAttribute("height", 6);
    range.setAttribute("rx", 3);
    range.setAttribute("fill", p.color);
    range.setAttribute("opacity", "0.35");
    range.setAttribute("class", "spectrum__range");

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", xCenter);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 5);
    dot.setAttribute("fill", p.color);
    dot.setAttribute("class", "spectrum__dot");

    node.appendChild(range);
    node.appendChild(dot);
    group.appendChild(node);
  });

  // Tooltip + click handlers via event delegation
  const showTooltip = (slug, evt) => {
    const pace = enriched.find((p) => p.slug === slug);
    if (!pace) return;
    tooltip.querySelector("[data-tip-label]").textContent = pace.label;
    tooltip.querySelector("[data-tip-pace]").textContent =
      `${pace.paceFast} → ${pace.paceSlow} min/km`;
    tooltip.querySelector("[data-tip-speed]").textContent =
      `${pace.pace} /km · ${pace.kmh} km/h`;

    const rect = spectrumEl.getBoundingClientRect();
    const targetRect = evt.currentTarget.getBoundingClientRect();
    const cx = targetRect.left + targetRect.width / 2 - rect.left;
    const cy = targetRect.top - rect.top;
    tooltip.style.left = `${cx}px`;
    tooltip.style.top = `${cy - 6}px`;
    tooltip.hidden = false;
  };

  const hideTooltip = () => {
    tooltip.hidden = true;
  };

  group.querySelectorAll(".spectrum__point").forEach((node) => {
    node.addEventListener("mouseenter", (e) => showTooltip(node.dataset.slug, e));
    node.addEventListener("focus", (e) => showTooltip(node.dataset.slug, e));
    node.addEventListener("mouseleave", hideTooltip);
    node.addEventListener("blur", hideTooltip);
    node.addEventListener("click", () => {
      const card = document.getElementById(`pace-${node.dataset.slug}`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.animate(
          [
            { boxShadow: "0 0 0 0 var(--zone-tempo)" },
            { boxShadow: "0 0 0 8px transparent" },
          ],
          { duration: 800, easing: "ease-out" }
        );
      }
    });
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        node.dispatchEvent(new MouseEvent("click"));
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Calculator
// ---------------------------------------------------------------------------

function renderCalculator() {
  const select = document.querySelector("[data-calc-pace]");
  const distance = document.querySelector("[data-calc-distance]");
  const result = document.querySelector("[data-calc-result]");
  const meta = document.querySelector("[data-calc-meta]");

  const groups = [
    { label: "Compétition", category: "competition", order: (a, b) => a.value - b.value },
    { label: "Entraînement", category: "training", order: (a, b) => b.value - a.value },
  ];

  groups.forEach(({ label, category, order }) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = label;
    enriched
      .filter((p) => p.category === category)
      .sort(order)
      .forEach((p) => {
        const option = document.createElement("option");
        option.value = p.slug;
        option.textContent = `${p.label} — ${p.pace} /km`;
        optgroup.appendChild(option);
      });
    select.appendChild(optgroup);
  });

  select.value = "marathon";
  distance.value = "42.195";

  const update = () => {
    const pace = enriched.find((p) => p.slug === select.value);
    const dist = parseFloat(distance.value);
    if (!pace || !Number.isFinite(dist) || dist <= 0) {
      result.textContent = "—";
      meta.textContent = "";
      return;
    }
    result.textContent = secPerKmToRaceTime(pace.value, dist);
    const fast = secPerKmToRaceTime(pace.value - pace.dvalue, dist);
    const slow = secPerKmToRaceTime(pace.value + pace.dvalue, dist);
    meta.textContent = `entre ${fast} et ${slow} · ${pace.paceFast} → ${pace.paceSlow} /km`;
  };

  select.addEventListener("change", update);
  distance.addEventListener("input", update);
  update();
}

// ---------------------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------------------

function setupReveals() {
  const targets = document.querySelectorAll(".section, .card");
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  targets.forEach((el) => io.observe(el));
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderCompetition();
  setupCompetitionToggle();
  renderSpectrum();
  renderCalculator();
  renderDate();
  setupReveals();
});
