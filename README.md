# Mes allures

Site statique présentant mes allures de course personnelles : zones
d'entraînement et allures de compétition — exprimées en min/km et km/h.

## Lancer en local

Ouvrir `index.html` directement dans un navigateur (double-clic) ou servir le
dossier avec un mini-serveur :

```bash
npx http-server . -p 8000
# puis http://localhost:8000
```

## Structure

```
index.html                  page d'accueil (hub) — liens vers les rubriques
allures.html                page des allures (hero, intro, spectre, calculateur)
distance.html               analyse des distances hebdo + sorties longues
style.css                   design system sombre, layout responsive, animations
app.js                      données + rendu DOM (page allures)
distance.js                 données (bloc WEEKS généré) + graphiques (page distances)
program.json                export brut du programme (source des données distance)
scripts/extract-program.js  régénère le bloc WEEKS de distance.js depuis program.json
vercel.json                 config de déploiement (clean URLs, cache headers)
.vercelignore               exclusions pour le déploiement
```

Aucune dépendance, aucun build.

## Mettre à jour l'analyse des distances

Les données de `distance.js` (bloc `WEEKS`) sont générées depuis `program.json`.
Après un changement de programme, régénère-les :

```bash
node scripts/extract-program.js
```

Le script extrait pour chaque semaine l'index, la date, la phase
(`context.cycleTheme`), le volume hebdo (`weekStats.expectedDistance`) et la
distance de la sortie longue (séances `road_long_run` / `SL`), puis remplace le
bloc entre les marqueurs `// <WEEKS:start>` et `// <WEEKS:end>`. Le reste de la
page (récup, affûtage, légende, nombre de semaines) s'adapte automatiquement.

## Déployer sur Vercel

### Option 1 — CLI

```bash
npm i -g vercel       # une seule fois
vercel                # déploie un preview
vercel --prod         # déploie en prod
```

### Option 2 — Git

Pousser le repo sur GitHub/GitLab, puis sur
[vercel.com/new](https://vercel.com/new), importer le projet.

Vercel détecte automatiquement le site statique (`index.html` à la racine),
applique le `vercel.json` (clean URLs, headers de cache) et publie.
