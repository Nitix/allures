---
name: design-system
description: Reference for the "allures" running site's visual language — design tokens (colors, fonts, spacing), the shared components (.site-nav, .btn, .card, .nav-card, .intro-item, .calculator), and conventions. Use whenever building, editing, or reviewing markup/CSS in this repo so new work stays coherent with the existing dark theme.
---

# Allures design system

A dependency-free, no-build static site (vanilla HTML/CSS/JS) about personal running paces. All styling lives in `style.css` and is driven by CSS custom properties. Stay coherent by reusing tokens and existing component classes rather than inventing new colors or spacing.

## Tokens (`:root` in `style.css`)

Always reference these variables — never hardcode hex values.

| Purpose | Variable |
| --- | --- |
| Page background | `--bg` (`#0a0e14`) + `--bg-gradient` |
| Surfaces (cards, inputs) | `--surface`, `--surface-elevated`, `--surface-hover` |
| Borders | `--border`, `--border-strong` |
| Text | `--text`, `--text-muted`, `--text-dim` |
| Zone accents (slow→fast) | `--zone-easy` (green), `--zone-tempo` (blue), `--zone-threshold` (amber), `--zone-vma` (orange), `--zone-sprint` (red) |
| Fonts | `--font-sans` (Inter), `--font-mono` (JetBrains Mono) |
| Radii | `--radius` (14px), `--radius-lg` (20px) |
| Card shadow | `--shadow-card` |
| Layout | `--max-width` (1200px), `--gutter` (`clamp(20px,4vw,48px)`) |

Conventions:
- **Numbers and data** (paces, times, speeds) use `--font-mono`. Prose uses `--font-sans`.
- **Accent color** for interactive/primary emphasis is `--zone-tempo` (blue). The five zone colors form the signature gradient used on `.hero__title-accent` and `.intro-item::before`.
- Use `color-mix(in srgb, var(--zone-tempo) N%, ...)` for tinted backgrounds/borders, matching existing patterns.
- Hover lift is `transform: translateY(-2px|-3px)` with a border-color change.
- Respect `@media (prefers-reduced-motion: reduce)` — already handled globally.

## Page skeleton

Every page shares this structure (see `index.html` / `allures.html`):

```html
<body>
  <nav class="site-nav" aria-label="Navigation principale"> … </nav>
  <header class="hero"><div class="hero__inner"> … </div></header>
  <main>
    <section class="section" aria-labelledby="…-title"> … </section>
  </main>
  <footer class="footer"> … </footer>
</body>
```

- Pages link `style.css`. Only pages with dynamic pace content link `app.js` (it expects `[data-grid]`, `[data-calculator]`, `[data-points]`, `[data-today]` hooks — omit it on static pages).
- `lang="fr"`; UI copy is in French.

## Shared components

- **`.site-nav`** — sticky blurred top bar. `.site-nav__inner` > `.site-nav__brand` (with `.site-nav__brand-dot`) + `.site-nav__links` > `.site-nav__link`. Mark the current page's link with `aria-current="page"`.
- **`.btn`** / **`.btn--primary`** — pill button/link. Primary uses the blue accent on a dark text.
- **`.hero`** — top banner: `.hero__eyebrow` (uppercase label), `.hero__title` (with `.hero__title-accent` for the gradient word), `.hero__subtitle`.
- **`.section`** — content block with `.section__header` > `.section__title` + `.section__subtitle`.
- **`.nav-card`** (landing hub) — `.nav-card__tag`, `.nav-card__title`, `.nav-card__desc`, `.nav-card__cta`. Use `.nav-card--soon` for disabled "coming" cards.
- **`.card`** (pace card) — rendered by `app.js`; sets `--card-color` per zone. Don't author by hand.
- **`.intro-item`** — small stat tile (grid of 4).
- **`.calculator`** / **`.toggle`** — form control patterns.

## Where things live

```
index.html     landing hub
allures.html   paces page (loads app.js)
style.css      all styles, organized by section comments (/* ---------- X ---------- */)
app.js         pace data (PACES/META), helpers, DOM rendering, interactions
vercel.json    cleanUrls:true → /allures serves allures.html in prod (not on local http-server)
```

When adding CSS, append a new `/* ---------- NAME ---------- */` section to keep `style.css` organized.
