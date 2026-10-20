# Cinematic video hero: reusable prompt template

Fill in every `[FIELD]`, delete this header, then send the prompt (below the line) to Lovable.
Send it in **plan mode first**, and check the project ID before sending.

## Fill-in fields

| Field | What to put | Example |
| --- | --- | --- |
| `[PROJECT]` | Lovable project name and ID the prompt is going to | Chalcopyrite, f8e1dff4-d2a7-49d9-a60a-5b7bbd587a90 |
| `[LANGUAGES]` | Site languages (all new text must be translated) | FR/EN, or RO only |
| `[BRAND]` | Brand name shown in the nav | Organic Visions |
| `[NAV_LINKS]` | 3 to 5 links, each going to a real section or page | Wander, Archive, Story, Connect |
| `[HEADLINE_1]` / `[HEADLINE_2]` | Two headline lines, short, upper case | WITNESS THE / HIDDEN REALM |
| `[SUBTITLE_1]` / `[SUBTITLE_2]` | Subtitle in two parts (line break shows from the sm breakpoint) | An odyssey through delicate living forms, / revealed by lens and curiosity. |
| `[CTA_TEXT]` / `[CTA_TARGET]` | Button label and the section or page it opens | Begin the Experience, #contact |
| `[VIDEO_URL]` | Looping video (mp4). Prefer a file uploaded to the project over a hotlink | https://... |
| `[POSTER_IMAGE]` | Still image shown while the video loads, and on phones | an uploaded jpg |
| `[HEADING_FONT]` | Serif for the headline. Prefer a Google Font (EB Garamond, Cormorant Garamond) | EB Garamond |
| `[PAGE_TITLE]` / `[META_DESCRIPTION]` | Browser tab title and search description | Synthetic Nature |

---

# Prompt (copy from here)

Work only in the project **[PROJECT]**. Change the home page hero and nothing else: keep other pages, the database, existing content, the contact form logic and the SEO structure unchanged. Languages: **[LANGUAGES]**. Translate all new text and keep the existing language switch and its saved preference, if the site has one. Please give me a plan first and do not change any code yet.

Create a full-screen cinematic hero section using the project's existing stack (React, Tailwind CSS and Framer Motion; add `framer-motion` and `lucide-react` only if missing). Use the project's existing Tailwind setup and file structure; do not add a new build setup.

**Video background**
- Full-screen looping background video, absolutely positioned to fill the viewport, `object-cover object-center`.
- Source: **[VIDEO_URL]**. Properties: autoPlay, muted, loop, playsInline. Poster image: **[POSTER_IMAGE]**.
- Add a light dark overlay (about 20 to 30 percent black) so white text stays readable.
- On phones and with `prefers-reduced-motion: reduce`: show only the poster image, no autoplaying video.
- Page background `#010101`, full viewport height, overflow hidden.

**Fonts** (load in the project's root layout, not an `index.html`)
- Headline font class `.font-garamond`: `'[HEADING_FONT]', 'Times New Roman', serif`.
- Body font: Geist from Google Fonts, weights 300, 400, 500: `'Geist', -apple-system, BlinkMacSystemFont, sans-serif`.

**Navigation**
- Relative, z-20. Flex, centered on desktop, space-between on mobile.
- Brand name "[BRAND]": white, uppercase, letter-spacing 0.25em (mobile) / 0.3em (desktop), font-light.
- Desktop links: [NAV_LINKS], white/80, uppercase, 0.2em tracking, hover to white, 300ms transition. Each link goes to a real section or page.
- Mobile: hamburger toggle with lucide-react `Menu` and `X` icons (size 22). The toggle needs an `aria-label` and `aria-expanded`, and Escape closes the menu.

**Mobile menu**
- Fixed, top-16, left-4, right-4, z-50, hidden from md up. Use `AnimatePresence`.
- Animation: fade in from y:-10 to y:0, 0.3s, ease easeOut; reverse on exit.
- Links stagger in: opacity 0 to 1, y:-8 to 0, delay `0.05 + index * 0.06`.
- Links: white/90, 0.25em tracking, uppercase, font-light, hover to white.
- Class `.mobile-menu-glass`:
  ```css
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  ```
- Rounded-2xl, py-8, gap-5, flex-col, centered.

**Hero content**
- Relative z-10, flex-col, centered, text-center. Padding: px-5 (sm:px-8), pt-12 (sm:pt-16, md:pt-24).
- Heading, two lines: "[HEADLINE_1]" and "[HEADLINE_2]". Garamond class, sizes 4xl / 6xl / 8xl / 9xl responsive, font-normal, white, line-height 1.08, tracking-tight, mb-6 (sm:mb-8).
- Each line uses a `StaggeredFade` component that splits the text into characters and fades each in (opacity 0 to 1, y 0) with a 0.07s stagger, triggered once when in view (`useInView`, once: true).
- Accessibility: put the full headline in an `aria-label` on the heading and mark the per-letter spans `aria-hidden`, so screen readers do not spell letters. With reduced motion, show the headline immediately without animation.

**Subtitle**
- Framer Motion paragraph, initial opacity 0 and y 20, animate to opacity 1 and y 0, 0.8s, delay 1.6s.
- Text: "[SUBTITLE_1]" (line break hidden on mobile, visible from sm) "[SUBTITLE_2]".
- White/70, font-light, leading-relaxed, max-w-xs (sm:max-w-md), mb-8 (sm:mb-10). Sizes text-sm / text-base / text-lg.

**CTA button**
- Framer Motion, initial opacity 0 and y 20, animate to opacity 1 and y 0, 0.8s, delay 2.0s.
- Text: "[CTA_TEXT]", links to **[CTA_TARGET]**. Class `.liquid-glass`, rounded-full, padding px-7/px-10 and py-3.5/py-4.
- White/90, uppercase, tracking 0.18em / 0.2em responsive. Visible keyboard focus ring.

**Liquid glass CSS**
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15);
}
.liquid-glass:active { transform: scale(0.98); }
```

**Global**
- Antialiased font smoothing, white text, `#010101` page background for this hero.
- Page title: "[PAGE_TITLE]". Meta description: "[META_DESCRIPTION]". Keep all other meta tags and structured data unchanged.
