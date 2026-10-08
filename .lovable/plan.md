# Plan: aspect premium pentru #facemceneplace

Direcție aleasă: rafinament tipografic, mișcare cinematografică, texturi și lumini. Hero-ul (imagine și layout) rămâne neschimbat. Toate animațiile trec prin hook-ul `useEnhancedMotion`, doar transform/opacity, scroll-ul paginii nu e interceptat; pe mobil sau reduced-motion rămân doar fade-uri de opacitate.

## 1. Rafinament tipografic
- Scala tipografică mai editorială: titluri de secțiune mai mari (până la ~76px pe desktop), interlinie mai aerisită, `letter-spacing` fin pe kicker-uri și etichete.
- Kicker-uri de secțiune cu linie decorativă mai lungă și numerotare discretă (01 / 02 / 03) în stil editorial.
- Citatele din recenzii în Playfair Display italic, mai mari, cu ghilimele decorative aurii.
- Footer și nav cu micro-tipografie mai curată (spațieri consistente, dimensiuni armonizate).

## 2. Mișcare cinematografică
- Apariții în cascadă (stagger) la titluri, kicker-uri și carduri, cu easing-ul existent `--ease`, durate ușor mai lungi.
- Titluri de secțiune cu revelare pe mască (MaskReveal existent) aplicată consecvent pe toate secțiunile.
- Hover-uri mai fine: butoane cu umplere graduală, linkuri cu subliniere animată, carduri de recenzie cu ridicare subtilă.
- Lightbox: tranziție de deschidere/închidere mai lentă și fluidă (doar transform/opacity).

## 3. Texturi și lumini
- Granulație subtilă de film (noise SVG, opacitate foarte mică, `pointer-events: none`) peste întreaga pagină, dezactivată la reduced-motion.
- Vignete fine pe secțiunea de poveste și pe contact (gradient radial discret peste foto).
- Strat de lumină caldă suplimentar în hero (peste overlay-ul existent, fără să atingă imaginea sau layout-ul) și reflexii aurii discrete la marginea titlurilor.
- Separatori de secțiune: linii fine cu un mic romb/punct auriu central în loc de borduri simple.

## 4. Verificare
- Build + lint + typecheck verzi; verificare vizuală cu Playwright (desktop + reduced-motion) că animațiile noi respectă gating-ul și scroll-ul rămâne nativ.
- Fără dependențe noi grele; fără modificări de conținut, structură de date sau admin.

## Detalii tehnice
- Modificări concentrate în `src/styles.css` (tokeni noi: `--grain-opacity`, vignete, separatori) și `src/routes/index.tsx` + `src/components/portfolio-gallery.tsx` (aplicarea MaskReveal/stagger existente din `motion-kit`).
- Tokeni noi adăugați în `:root`, nu valori hardcodate; utilitarele Tailwind existente rămân neschimbate.
