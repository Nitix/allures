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
index.html     page d'accueil (hub) — liens vers les rubriques
allures.html   page des allures (hero, intro, spectre, sections, calculateur)
distance.html  analyse des distances hebdo + sorties longues (graphiques)
style.css      design system sombre, layout responsive, animations
app.js         données, helpers, rendu DOM, interactions (page allures)
distance.js    dataset 18 semaines + rendu des graphiques (page distances)
vercel.json    config de déploiement (clean URLs, cache headers)
.vercelignore  exclusions pour le déploiement
```

Aucune dépendance, aucun build.

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
