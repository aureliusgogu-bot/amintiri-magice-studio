# Amintiri Magice Studio — Guidelines

## Components

The design system exports these components — import them from `@ws-1062323c948fe9abd9f7/c0abf0ef-62c9-4d0c-a176-953f5ccc36d3` and compose them before building anything from scratch:

`Button`, `CountUp`, `CursorRing`, `Magnetic`, `Marquee`, `MaskReveal`, `ParallaxPhoto`, `PortfolioGallery`, `Reveal`, `ScrollProgress`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-1062323c948fe9abd9f7/c0abf0ef-62c9-4d0c-a176-953f5ccc36d3/styles.css` (source — preferred import)
- `@ws-1062323c948fe9abd9f7/c0abf0ef-62c9-4d0c-a176-953f5ccc36d3/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)
