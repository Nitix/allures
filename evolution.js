// ---------------------------------------------------------------------------
// Évolution des allures — deux comparaisons commutables
//
//   1) « Au début → maintenant » : progression réelle entre deux relevés datés
//      (un nouveau program-XX-XX.json par mois). Chaque relevé = la SEMAINE
//      COURANTE à sa date (dernière weekDate <= date du relevé), c'est ce que
//      Campus affiche « aujourd'hui ». Prendre la semaine 0 (début de plan)
//      donne des valeurs trop lentes.
//        - 26 mai : plan pas démarré (début 1er juin) -> semaine 0.
//        - 28 juin : 3e semaine de plan (22→28 juin) -> semaine 3 (VMA 3:39).
//
//   2) « Actuelles → estimées » : dans le plan en cours (program-28-06.json),
//      ma semaine actuelle (semaine 3) face à l'estimation de fin de plan
//      (dernière semaine = objectif course).
//
// Pour publier un nouveau relevé : ajouter une entrée à PROGRESSION.readings
// (label + paces de la semaine courante), et mettre à jour PLAN avec la nouvelle
// semaine actuelle et la nouvelle estimation de fin de plan. Pensez aussi à
// rafraîchir le tableau PACES de app.js (même semaine actuelle).
// ---------------------------------------------------------------------------

// Relevés réels dans le temps (du plus ancien au plus récent).
const PROGRESSION = {
  id: "progress",
  tab: "Au début → maintenant",
  title: "Ma progression dans le temps",
  subtitle:
    "Mes allures relevées à chaque mise à jour de programme — du premier relevé à aujourd'hui.",
  mode: "past",
  readings: [
    {
      label: "26 mai",
      sub: "Début",
      paces: {
        slow: 648.1654122303548,
        ef: 352.20982463356916,
        aerobie: 341.6340957993739,
        "sweet-spot": 287.3237021851863,
        tempo: 321.72613517377647,
        seuil60: 272.7326186525651,
        seuil30: 258.88251025369294,
        vma: 226.25266844699118,
        "endurance-confort": 366.00095536565965,
        marathon: 311.5132957936629,
        "half-marathon": 283.33203717851734,
        "10km": 266.645810422317,
        "5km": 252.0345924846449,
        "1500m": 228.53282873363534,
      },
    },
    {
      label: "28 juin",
      sub: "Maintenant",
      paces: {
        slow: 631.7701735532241,
        ef: 342.20167030600857,
        aerobie: 331.8732566315678,
        "sweet-spot": 278.86062681735723,
        tempo: 312.4354502130143,
        seuil60: 264.6268027341291,
        seuil30: 251.1195127275994,
        vma: 219.3127359244279,
        "endurance-confort": 355.67273588285195,
        marathon: 301.57554208265526,
        "half-marathon": 274.2933090024231,
        "10km": 258.05030199767657,
        "5km": 243.83192432192627,
        "1500m": 220.97199303213,
      },
    },
  ],
};

// Plan en cours : actuelles (semaine 3) → estimées (fin de plan, 28 sept).
const PLAN = {
  id: "plan",
  tab: "Actuelles → estimées",
  title: "Là où le plan m'emmène",
  subtitle:
    "Mes allures actuelles face à celles estimées en fin de plan (objectif course du 28 septembre 2026).",
  mode: "future",
  goalDate: "28 sept",
  goalDistance: 42.195,
  readings: [
    {
      label: "Actuelles",
      sub: "Sem. 3 · 28 juin",
      paces: PROGRESSION.readings[1].paces,
    },
    {
      label: "Estimées",
      sub: "Fin de plan · 28 sept",
      paces: {
        slow: 608.5790927339616,
        ef: 329.6400981951897,
        aerobie: 319.690820931877,
        "sweet-spot": 268.6241838756791,
        tempo: 300.96653939701105,
        seuil60: 254.91285638773147,
        seuil30: 241.90139329311322,
        vma: 211.26218273843037,
        "endurance-confort": 342.6166665900007,
        marathon: 289.6182918061959,
        "half-marathon": 263.4177793681225,
        "10km": 247.81879574357697,
        "5km": 234.16416637188365,
        "1500m": 212.21061468385182,
      },
    },
  ],
};

// Prévu vs réel : ce que le plan d'ORIGINE (program-26-05.json) estimait pour la
// semaine du 28 juin (semaine 3 de ce plan, 22→28 juin) face à ce que je vaux
// réellement à cette date (semaine courante du nouveau plan). Montre si je suis
// en avance ou en retard sur la prévision initiale.
const FORECAST = {
  id: "forecast",
  tab: "Prévu → réel",
  title: "En avance sur le plan d'origine ?",
  subtitle:
    "Ce que mon plan du 26 mai prévoyait pour aujourd'hui, face à mes allures réelles au 28 juin.",
  mode: "forecast",
  targetDate: "28 juin",
  readings: [
    {
      label: "Prévu",
      sub: "estimé le 26 mai",
      paces: {
        slow: 642.9972892267034,
        ef: 349.4014925898438,
        aerobie: 338.91008893937027,
        "sweet-spot": 285.0327372451595,
        tempo: 319.16086370341804,
        seuil60: 270.5579951788219,
        seuil30: 256.8183201083388,
        vma: 224.44865114157068,
        "endurance-confort": 363.08266024979565,
        marathon: 308.8283853316844,
        "half-marathon": 280.89001893690056,
        "10km": 264.34760955669543,
        "5km": 249.86232464478115,
        "1500m": 226.56312088791012,
      },
    },
    {
      label: "Réel",
      sub: "au 28 juin",
      paces: PROGRESSION.readings[1].paces,
    },
  ],
};

const COMPARISONS = { progress: PROGRESSION, forecast: FORECAST, plan: PLAN };

// Libellés et regroupement des allures affichées.
const META = {
  marathon: { label: "Marathon", tag: "42,2 km", group: "competition", dist: 42.195 },
  "half-marathon": { label: "Semi-marathon", tag: "21,1 km", group: "competition", dist: 21.0975 },
  "10km": { label: "10 km", tag: "10 km", group: "competition", dist: 10 },
  "5km": { label: "5 km", tag: "5 km", group: "competition", dist: 5 },
  "1500m": { label: "1500 m", tag: "1,5 km", group: "competition", dist: 1.5 },
  slow: { label: "Footing très lent", tag: "Récup", group: "training" },
  "endurance-confort": { label: "Endurance confort", tag: "Confort", group: "training" },
  ef: { label: "Endurance fondamentale", tag: "EF", group: "training" },
  aerobie: { label: "Aérobie", tag: "Aérobie", group: "training" },
  "sweet-spot": { label: "Sweet-spot", tag: "Sweet-spot", group: "training" },
  tempo: { label: "Tempo", tag: "Tempo", group: "training" },
  seuil60: { label: "Seuil 60 min", tag: "Seuil", group: "training" },
  seuil30: { label: "Seuil 30 min", tag: "Seuil", group: "training" },
  vma: { label: "VMA", tag: "VMA", group: "training" },
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

/** seconds per km → km/h with 1 decimal, comma as decimal separator (fr) */
function secToKmh(sec) {
  return (3600 / sec).toFixed(1).replace(".", ",");
}

/** total seconds → "3h24" (heures + minutes arrondies) */
function formatRaceTimeShort(totalSeconds) {
  const total = Math.round(totalSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.round((total % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

/** total seconds → "3h32:05" ou "20:18" */
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

/** Map pace (sec/km) to a zone color CSS variable. */
function zoneColor(secPerKm) {
  if (secPerKm > 330) return "var(--zone-easy)";
  if (secPerKm > 280) return "var(--zone-tempo)";
  if (secPerKm > 240) return "var(--zone-threshold)";
  if (secPerKm > 200) return "var(--zone-vma)";
  return "var(--zone-sprint)";
}

/** Signed seconds → "−4 s" / "+2 s" / "0 s" (rounded). */
function formatDeltaSeconds(deltaSec) {
  const rounded = Math.round(deltaSec * 10) / 10;
  if (Math.abs(rounded) < 0.05) return "0 s";
  const sign = rounded < 0 ? "−" : "+";
  const abs = Math.abs(rounded);
  const text = Number.isInteger(abs) ? String(abs) : abs.toFixed(1).replace(".", ",");
  return `${sign}${text} s`;
}

/** First vs last reading of a comparison for a given slug. */
function changeFor(cmp, slug) {
  const readings = cmp.readings;
  const a = readings[0].paces[slug];
  const b = readings[readings.length - 1].paces[slug];
  const delta = b - a; // sec/km ; négatif = plus rapide
  let direction = "flat";
  if (delta <= -0.05) direction = "faster";
  else if (delta >= 0.05) direction = "slower";
  return { a, b, delta, direction };
}

/** Texte du sens d'évolution selon le mode de comparaison. */
function directionLabel(direction, mode) {
  if (mode === "forecast") {
    if (direction === "flat") return "dans les temps";
    return direction === "faster" ? "d'avance" : "de retard";
  }
  if (direction === "flat") return "stable";
  if (mode === "future") {
    return direction === "faster" ? "à gagner" : "à perdre";
  }
  return direction === "faster" ? "plus rapide" : "plus lent";
}

// ---------------------------------------------------------------------------
// Rendering — cards
// ---------------------------------------------------------------------------

function createEvolutionCard(cmp, slug) {
  const meta = META[slug];
  const last = cmp.readings[cmp.readings.length - 1];
  const color = zoneColor(last.paces[slug]);
  const { delta, direction } = changeFor(cmp, slug);

  const card = document.createElement("article");
  card.className = "card evo-card";
  card.style.setProperty("--card-color", color);

  const steps = cmp.readings
    .map((reading, i) => {
      const value = reading.paces[slug];
      const isLast = i === cmp.readings.length - 1;
      return `
      <div class="evo-step${isLast ? " evo-step--current" : ""}">
        <span class="evo-step__pace">${secToMinKm(value)}</span>
        <span class="evo-step__date">${reading.label}</span>
      </div>`;
    })
    .join('<span class="evo-arrow" aria-hidden="true">→</span>');

  const first = cmp.readings[0];
  const arrow = direction === "faster" ? "↘" : direction === "slower" ? "↗" : "→";

  // Allures de compétition uniquement : temps de course estimé par relevé.
  const raceRow = meta.dist
    ? `
    <div class="evo-race">
      <span class="evo-race__label">Temps estimé · ${meta.tag}</span>
      <div class="evo-race__values">
        ${cmp.readings
          .map((reading, i) => {
            const isLast = i === cmp.readings.length - 1;
            return `<span class="evo-race__time${
              isLast ? " evo-race__time--current" : ""
            }">${formatRaceTime(reading.paces[slug] * meta.dist)}</span>`;
          })
          .join('<span class="evo-race__arrow" aria-hidden="true">→</span>')}
      </div>
    </div>`
    : "";

  card.innerHTML = `
    <span class="card__zone-bar" aria-hidden="true"></span>
    <header class="card__head">
      <h3 class="card__name">${meta.label}</h3>
      <span class="card__tag">${meta.tag}</span>
    </header>

    <div class="evo-track" aria-label="Allure min/km par relevé">
      ${steps}
    </div>

    ${raceRow}

    <div class="evo-delta evo-delta--${direction}">
      <span class="evo-delta__arrow" aria-hidden="true">${arrow}</span>
      <span class="evo-delta__value">${formatDeltaSeconds(delta)}/km</span>
      <span class="evo-delta__label">${directionLabel(direction, cmp.mode)}</span>
    </div>

    <div class="card__meta">
      <div class="card__meta-item">
        <span class="card__meta-label">Vitesse ${first.label}</span>
        <span class="card__meta-value">${secToKmh(first.paces[slug])} km/h</span>
      </div>
      <div class="card__meta-item">
        <span class="card__meta-label">Vitesse ${last.label}</span>
        <span class="card__meta-value">${secToKmh(last.paces[slug])} km/h</span>
      </div>
    </div>
  `;

  return card;
}

function renderGroup(cmp, group, selector) {
  const grid = document.querySelector(selector);
  if (!grid) return;
  const last = cmp.readings[cmp.readings.length - 1];
  const slugs = Object.keys(META)
    .filter((slug) => META[slug].group === group)
    .sort((a, b) => last.paces[b] - last.paces[a]); // plus lent → plus rapide
  grid.replaceChildren(...slugs.map((slug) => createEvolutionCard(cmp, slug)));
}

// ---------------------------------------------------------------------------
// Rendering — résumé « en bref »
// ---------------------------------------------------------------------------

function buildSummaryItems(cmp) {
  const slugs = Object.keys(META);
  const changes = slugs.map((slug) => ({ slug, ...changeFor(cmp, slug) }));
  const fasterCount = changes.filter((c) => c.direction === "faster").length;
  const best = changes.reduce((a, b) => (b.delta < a.delta ? b : a));
  const first = cmp.readings[0];
  const last = cmp.readings[cmp.readings.length - 1];

  if (cmp.mode === "forecast") {
    const aheadCount = changes.filter((c) => c.direction === "faster").length;
    const marathon = changeFor(cmp, "marathon");
    return [
      {
        value: cmp.targetDate,
        label: "Date visée",
        desc: "Allures prévues le 26 mai pour cette semaine, face aux réelles.",
      },
      {
        value: `${aheadCount}<span class="intro-item__unit">/ ${slugs.length}</span>`,
        label: "Allures en avance",
        desc: "Plus rapides que ce que le plan d'origine prévoyait.",
      },
      {
        value: formatDeltaSeconds(best.delta),
        label: "Meilleure avance",
        desc: `Sur « ${META[best.slug].label} » — ${secToMinKm(
          first.paces[best.slug]
        )} → ${secToMinKm(last.paces[best.slug])} /km.`,
      },
      {
        value: `${secToMinKm(marathon.b)}<span class="intro-item__unit">/km</span>`,
        label: "Marathon réel",
        desc: `Prévu ${secToMinKm(marathon.a)} → réel ${secToMinKm(
          marathon.b
        )} /km.`,
      },
    ];
  }

  if (cmp.mode === "future") {
    const marathonEst = last.paces["marathon"];
    return [
      {
        value: cmp.goalDate,
        label: "Objectif",
        desc: "Course visée en fin de plan (18 semaines).",
      },
      {
        value: formatRaceTimeShort(marathonEst * cmp.goalDistance),
        label: "Marathon estimé",
        desc: `À l'allure de fin de plan (${secToMinKm(marathonEst)} /km).`,
      },
      {
        value: `${fasterCount}<span class="intro-item__unit">/ ${slugs.length}</span>`,
        label: "Allures à gagner",
        desc: "Allures encore à améliorer d'ici l'objectif.",
      },
      {
        value: formatDeltaSeconds(best.delta),
        label: "Plus gros gain visé",
        desc: `Sur « ${META[best.slug].label} » — ${secToMinKm(
          first.paces[best.slug]
        )} → ${secToMinKm(last.paces[best.slug])} /km.`,
      },
    ];
  }

  // mode "past" : progression réelle.
  return [
    {
      value: `${first.label}<span class="intro-item__arrow">→</span>${last.label}`,
      label: "Période",
      desc: "De mon premier relevé à aujourd'hui.",
    },
    {
      value: String(cmp.readings.length),
      label: "Relevés",
      desc: "Mises à jour de mes allures depuis le lancement du site.",
    },
    {
      value: `${fasterCount}<span class="intro-item__unit">/ ${slugs.length}</span>`,
      label: "Allures plus rapides",
      desc: "Nombre d'allures gagnées entre le premier et le dernier relevé.",
    },
    {
      value: formatDeltaSeconds(best.delta),
      label: "Meilleur gain",
      desc: `Sur « ${META[best.slug].label} » — ${secToMinKm(
        first.paces[best.slug]
      )} → ${secToMinKm(last.paces[best.slug])} /km.`,
    },
  ];
}

function renderSummary(cmp) {
  const grid = document.querySelector("[data-summary]");
  if (!grid) return;
  grid.replaceChildren(
    ...buildSummaryItems(cmp).map((item) => {
      const li = document.createElement("li");
      li.className = "intro-item";
      li.innerHTML = `
        <span class="intro-item__value">${item.value}</span>
        <span class="intro-item__label">${item.label}</span>
        <span class="intro-item__desc">${item.desc}</span>
      `;
      return li;
    })
  );
}

// ---------------------------------------------------------------------------
// Comparison switching (onglets)
// ---------------------------------------------------------------------------

function renderComparison(key) {
  const cmp = COMPARISONS[key];
  if (!cmp) return;

  const title = document.querySelector("[data-cmp-title]");
  const subtitle = document.querySelector("[data-cmp-subtitle]");
  if (title) title.textContent = cmp.title;
  if (subtitle) subtitle.textContent = cmp.subtitle;

  renderSummary(cmp);
  renderGroup(cmp, "competition", '[data-grid="competition"]');
  renderGroup(cmp, "training", '[data-grid="training"]');
}

function setupTabs() {
  const tabs = [...document.querySelectorAll("[data-tab]")];

  const activate = (key) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === key;
      tab.setAttribute("aria-selected", String(on));
    });
    renderComparison(key);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.tab));
  });

  activate("progress");
}

// ---------------------------------------------------------------------------
// Scroll reveal (sections uniquement — les cartes sont re-rendues aux onglets)
// ---------------------------------------------------------------------------

function setupReveals() {
  const targets = document.querySelectorAll(".section");
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
  setupReveals();
  setupTabs();
});
