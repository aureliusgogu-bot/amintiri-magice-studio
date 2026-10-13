# #facemceneplace — Design System

Dark, cinematic, editorial. Near-black backgrounds, warm off-white text, one warm gold
accent, Playfair Display headings, DM Sans body (Manrope as secondary UI face).
Romanian-only copy. Animations are transform/opacity only, gated behind
`useEnhancedMotion()` — on mobile or with reduced motion, use simple opacity fades and
never hijack page scrolling.

## Fonts (required for consumers)

Brand fonts are loaded from Google Fonts via a `<link>` in the showcase root
(`src/routes/__root.tsx`). File-copy attach does **not** carry this link, so every
consumer must add it to its own root head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
/>
```

Without it, `font-display` (Playfair Display) and `font-sans` (DM Sans) fall back to
system fonts. `src/styles.css` is exported from the barrel and carries all tokens.

## Hard constraints

- Use design tokens (CSS variables / Tailwind theme in `src/styles.css`) — never raw
  hex values in components.
- Motion: `transform` and `opacity` only, gated by `useEnhancedMotion()`; page
  scrolling is never intercepted.
- Never invent business facts (prices, addresses, hours, testimonials).
- Keep the `cn()` helper and `EASE` motion constant for composition and timing.
