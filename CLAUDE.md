# CLAUDE.md — guide du projet « allures »

Site statique perso (course à pied) : mes allures, leur évolution, et l'analyse
des distances de mon programme marathon. **Pas de build, pas de dépendances** —
HTML + CSS + JS vanilla servis tels quels (Vercel, `cleanUrls`).

## Avant d'écrire du code

Lis d'abord les deux skills du repo (`.claude/skills/`) — ils ne sont PAS répétés ici :

- **`design-system`** — tokens (couleurs, fonts, espacements), composants partagés
  (`.site-nav`, `.hero`, `.section`, `.card`, `.intro-item`, `.chart`, `.toggle`…),
  conventions. **Toujours** réutiliser les variables CSS, jamais de hex en dur.
- **`add-page`** — gabarit + checklist pour ajouter une page (nav sur *toutes* les
  pages, carte sur le hub `index.html`, entrée README).

Copie FR partout (`lang="fr"`). Chiffres/temps/allures en `--font-mono`, prose en
`--font-sans`.

## Structure

```
index.html      hub d'accueil
allures.html    allures (charge app.js)
evolution.html  évolution des allures dans le temps (charge evolution.js)
distance.html   analyse + comparaison des distances (charge distance.js)
style.css       tout le style, sections /* ---------- NOM ---------- */
app.js / evolution.js / distance.js   données + rendu de chaque page
program-26-05.json / program-28-06.json   exports bruts du coach (source de données)
```

## ⚠️ Piège n°1 : quelle semaine extraire d'un `program-*.json`

Un `program-XX-XX.json` est un **tableau de ~18 semaines datées** (un plan
marathon), pas un instantané. Chaque semaine a un `weekDate` (lundi de la
semaine) et ses propres `estimatedPaces` / volumes, qui **s'améliorent semaine
après semaine**.

**Pour « mes allures/volumes actuels », prendre la SEMAINE COURANTE** = la
dernière semaine dont `weekDate <= date du relevé`. **Surtout PAS la semaine 0**
(début de plan), qui donne des valeurs trop lentes/faibles.

C'est ce que montre l'app du coach (« Campus »). Vérif faite : au 28/06/2026 la
semaine courante est l'index 3 (22→28 juin) → VMA 3:39 ; la semaine 0 donnait
3:47 (faux). Les deux exports démarrent le 01/06/2026.

Allures : `value` = sec/km, `dvalue` = demi-plage. **value plus basse = plus
rapide = progrès** (affiché en vert).

## ⚠️ Piège n°2 : dédup des allures abstraites dans `app.js`

`PACES` contient des entrées **abstraites** (`abstract: true` : moderate, vo2max,
endurance-fondamentale, endurance-active, slow, fast, sprint, endurance-confort).
Le pipeline supprime toute abstraite dont le `value` est **exactement égal** (au
flottant près, via un `Set`) à celui d'une entrée non-abstraite. Les paires
concernées : `moderate`=`seuil60`, `vo2max`=`vma`, `endurance-fondamentale`=`ef`,
`endurance-active`=`aerobie`.

→ En mettant `PACES` à jour, **recopie fidèlement** les valeurs de l'export : si
l'abstraite et sa jumelle non-abstraite n'ont plus le **même flottant exact**, la
dédup échoue et une carte en double / abstraite réapparaît. (slow/fast/sprint/
endurance-confort n'ont pas de jumelle → toujours gardées, c'est voulu.)

## Recettes d'extraction (les JSON font ~1,4 Mo → ne pas les `Read`, utiliser node)

Par semaine (`week`) :
- **Allures** : `week.estimatedPaces` (slugs : marathon, vma, seuil30… ; on
  ignore l'entrée `race`).
- **Volume hebdo (km)** : `week.weekStats.expectedDistance`.
- **Sortie longue** : la séance `week.sessions.find(s => s.trainingType === 'SL')`
  → `.stats.expectedDistance` (km) ou `.stats.expectedDuration` (s).
- **Phase** : `week.context.cycleTheme` (VMA / S60 / Force_A42 / affutage).

Note utile : les sorties longues sont **planifiées par durée** (quasi constante
d'un export à l'autre) ; c'est la **distance** qui bouge (allure meilleure → plus
de km dans la même durée). Comparer en km, pas en minutes.

## Où vivent les données (à mettre à jour à chaque nouvel export)

- `app.js` → `PACES` = semaine courante du dernier export (allures affichées).
- `evolution.js` → `PROGRESSION.readings` (1 relevé par export, semaine courante),
  `FORECAST` (ce que l'ancien plan prévoyait pour aujourd'hui vs réel),
  `PLAN` (semaine courante → estimation fin de plan).
- `distance.js` → `WEEKS` (programme courant) + `PREVIOUS` (programme précédent,
  pour la comparaison). Graphiques groupés via `renderGroupedCompare(...)`.

Workflow nouvel export : extraire la semaine courante, mettre à jour `PACES`,
ajouter un relevé à `PROGRESSION`, décaler `PLAN`/`FORECAST`, et faire glisser
`distance.js` (`WEEKS` ← nouveau, `PREVIOUS` ← ancien).

## Pièges code / CSS rencontrés

- `.chart` a `margin: 0`. Quand un graphique suit d'autres éléments dans une même
  section (tuiles, autre graphique), il faut un espacement explicite
  (`.intro-grid + .chart`, `.chart + .chart`) sinon ça se colle.
- Cartes re-rendues dynamiquement (onglets évolution) : **ne pas** leur mettre le
  reveal IntersectionObserver (elles resteraient invisibles après changement
  d'onglet) — n'observer que les `.section`.
- Pour les deltas de **volume**, couleur neutre (bleu/orange), pas vert/rouge :
  plus de volume n'est ni « mieux » ni « moins bien ». Pour les **allures**, oui :
  plus rapide = vert.
- **Helpers dupliqués** : `secToMinKm`, `secToKmh`, `formatRaceTime`, `zoneColor`
  existent à l'identique dans `app.js` ET `evolution.js` (les deux pages ne sont
  jamais chargées ensemble → pas de conflit, mais ils peuvent **diverger** —
  déjà arrivé une fois). Si tu en modifies un, applique le même changement dans
  l'autre fichier.
- **km/h en virgule décimale (FR) partout** : `(3600/sec).toFixed(1).replace('.', ',')`
  dans `app.js`/`evolution.js`, `toLocaleString('fr-FR')` dans `distance.js`.
- Les graphiques `renderGroupedCompare` n'affichent pas de barre pour une semaine
  à 0 (ex. S2/S18 sans sortie longue) — et ces semaines ne sont alors **pas
  focusables** (pas de point de donnée vide annoncé « 0 km »).

## Accessibilité (SVG, graphiques, onglets)

- **SVG interactif** : `<svg role="group" aria-label="…">` — **jamais** `role="img"`
  (rend le SVG atomique → masque les `aria-label` des enfants) ni `aria-hidden`
  s'il contient des nœuds focusables. Nœuds interactifs : `tabindex="0"` +
  `role="button"` + `aria-label`, et un **anneau de focus visible**
  (`:focus-visible { outline: 2px solid var(--zone-tempo) }` — un simple
  changement de couleur/opacité ne suffit pas). Décor (axe, dégradés) : `aria-hidden`.
- **Onglets** (page évolution) : motif ARIA tabs complet — `role="tablist"`/`tab`
  + `role="tabpanel"` + `aria-controls`, **roving tabindex** (un seul onglet
  `tabindex="0"`, les autres `-1`) et navigation clavier Flèches / Home / End
  (voir `setupTabs` dans `evolution.js`).
- Un slug absent d'un relevé évolution est **omis** proprement (helper
  `availableSlugs`) au lieu d'afficher des `NaN`.

## Vérification & déploiement

- Vérifier dans le navigateur via les outils `preview_*` (serveur `allures` dans
  `.claude/launch.json`, port 8765). Les URLs propres (`/allures`) ne marchent
  qu'en prod (Vercel) ; en local c'est `/allures.html`.
- L'outil `preview_screenshot` peut se bloquer : se rabattre sur `preview_eval`
  (inspection DOM) pour vérifier valeurs/structure.
- `main` est la branche de déploiement (Vercel auto-déploie au push). Demander
  avant de pousser sur `main`.
