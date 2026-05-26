---
name: add-page
description: Scaffold a new page on the "allures" running site that is coherent with the existing dark design system, and wire it into the shared nav and the landing hub. Use when the user wants to add a new page/section/rubrique to this site (e.g. "add a page for my training log", "create a stats page").
---

# Add a new page

Use this when adding a new HTML page to the site. It keeps the new page consistent with the shared layout and makes it reachable from navigation. Read the `design-system` skill first for tokens and component reference.

## Steps

1. **Pick a slug.** Lowercase, hyphenated, no extension (e.g. `journal`, `stats`). The file is `<slug>.html`; Vercel `cleanUrls` serves it at `/<slug>`.

2. **Create `<slug>.html`** from this template. Reuse `.site-nav`, `.hero`, `.section`, `.footer`. Only add `<script src="app.js" defer>` if the page needs the pace data/widgets (most new pages do **not**).

   ```html
   <!DOCTYPE html>
   <html lang="fr">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>TITRE · Course à pied</title>
       <meta name="description" content="DESCRIPTION" />
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
       <link rel="stylesheet" href="style.css" />
     </head>
     <body>
       <nav class="site-nav" aria-label="Navigation principale">
         <div class="site-nav__inner">
           <a class="site-nav__brand" href="/">
             <span class="site-nav__brand-dot" aria-hidden="true"></span>
             Mon espace course
           </a>
           <div class="site-nav__links">
             <a class="site-nav__link" href="/">Accueil</a>
             <a class="site-nav__link" href="/allures">Allures</a>
             <!-- NEW LINK GOES HERE on every page, see step 3 -->
           </div>
         </div>
       </nav>

       <header class="hero">
         <div class="hero__inner">
           <p class="hero__eyebrow">EYEBROW</p>
           <h1 class="hero__title">MOT <span class="hero__title-accent">ACCENT</span></h1>
           <p class="hero__subtitle">SOUS-TITRE</p>
         </div>
       </header>

       <main>
         <section class="section" aria-labelledby="x-title">
           <div class="section__header">
             <h2 id="x-title" class="section__title">TITRE SECTION</h2>
             <p class="section__subtitle">SOUS-TITRE SECTION</p>
           </div>
           <!-- content using design-system components -->
         </section>
       </main>

       <footer class="footer">
         <p>Mon espace course à pied · Format min/km — vitesse en km/h.</p>
       </footer>
     </body>
   </html>
   ```

3. **Add the nav link to EVERY page.** The nav is duplicated markup (no includes), so add `<a class="site-nav__link" href="/<slug>">LABEL</a>` to the `.site-nav__links` block in `index.html`, `allures.html`, and the new page. On the new page, give its own link `aria-current="page"`.

4. **Wire it into the landing hub** (`index.html`). Either replace the placeholder `.nav-card--soon` card or add a new one:

   ```html
   <a class="nav-card" href="/<slug>">
     <span class="nav-card__tag">TAG</span>
     <span class="nav-card__title">TITRE</span>
     <span class="nav-card__desc">DESCRIPTION</span>
     <span class="nav-card__cta">Ouvrir →</span>
   </a>
   ```

5. **Update `README.md`** — add the new file to the Structure block.

6. **Verify in the browser.** Start the `allures` preview server (`.claude/launch.json`) and confirm: the page renders, the nav highlights the right link, links navigate correctly, and no console errors. Locally `http-server` serves files at `/<slug>.html` (clean `/<slug>` URLs only resolve on Vercel).

## Notes

- Keep copy in French; `lang="fr"`.
- Don't introduce new colors/spacing — use the tokens (see `design-system`).
- No build step or dependencies — plain HTML/CSS/JS only.
