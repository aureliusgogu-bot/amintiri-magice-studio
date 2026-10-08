# Amintiri Magice Studio

Build a single-page, Romanian-only (lang="ro", all copy in Romanian) portfolio website for a photo and video studio called "#facemceneplace" (always written with the hashtag). Dark, cinematic, ultra-modern look: near-black background, warm off-white text, one warm accent colour, an elegant serif display font for headings and a clean sans for body text. Mobile-first and fast.

Sections, in order:
1. Hero: full-screen, large headline "#facemceneplace", subline "De peste 20 de ani, transformăm clipe în amintiri.", a "Vezi portofoliul" button that scrolls to the portfolio and a "Contact" button. Use a cinematic placeholder photo background with a subtle slow zoom.
2. Portfolio ("Portofoliu"): an immersive 3D photo wall. Use Framer Motion and Tailwind. Requirements: (a) 3D card tilt: each photo tilts smoothly on both X and Y axes following the cursor, with a soft moving light glare; (b) parallax: on desktop show 4 columns that move at different speeds while scrolling (back columns slower, smaller and dimmer, front columns faster) plus a slight mouse-driven sideways drift; (c) on hover the photo pops forward (scale + lift) with a deep dynamic drop shadow, implemented as a separate shadow layer that animates only transform and opacity; the photo title and category fade in; (d) clicking a photo opens a fluid fullscreen lightbox using a shared-element (layoutId) animation from the card to fullscreen, a sharper high-resolution copy fading in, previous/next buttons, left/right arrow keys, Escape to close, focus trapped inside, page scroll locked. Enhanced motion only at 768px+ with hover and no reduced-motion preference; on mobile or reduced motion use a simple 2-column grid with opacity fades only. Animate only transform and opacity. Images that fail to load must fall back to a gradient, never a broken image. Use 16 high-quality placeholder photos from Unsplash (weddings, portraits, couples, family, events, cinematic landscapes) with a simple data array at the top of the file (src, aspect ratio, category, Romanian title) so the real photos can be swapped in easily. Categories: Nunți, Portrete, Evenimente, Cinematic.
3. Despre noi ("Povestea noastră"): use exactly this text, with the hashtag highlighted in the accent colour:

"De peste 20 de ani, nu doar fotografiem și filmăm.
Păstrăm emoții. Păstrăm povești. Păstrăm oameni.
În tot acest timp, am învățat că cele mai frumoase momente nu se repetă.
Un zâmbet, o privire, o îmbrățișare, o lacrimă de fericire… sunt clipe care trec într-o secundă, dar care pot rămâne pentru o viață.
📸 Foto și 🎥 video pentru noi înseamnă mai mult decât imagini perfecte.
Înseamnă să fim acolo, să simțim momentul și să-l transformăm într-o amintire pe care să o retrăiești peste ani cu aceeași emoție.
De peste 20 de ani, facem ceea ce iubim.
Cu pasiune. Cu suflet. Cu respect pentru fiecare poveste care ne este încredințată.
Iar #facemceneplace nu este doar un hashtag.
Este felul nostru de a fi.
Este povestea noastră.
Este ceea ce ne reprezintă.
Pentru că atunci când faci ceea ce îți place, se vede în fiecare fotografie, în fiecare cadru și în fiecare poveste pe care o lași în urmă.
#facemceneplace ❤️
De peste 20 de ani, transformăm clipe în amintiri."

Next to it, a large number "20+" with the label "ani de amintiri". Reveal the text line by line on scroll.
4. Contact: title "Hai să păstrăm împreună momentul tău." Show the email facemceneplace@gmail.com as a mailto link, a Facebook button (https://www.facebook.com/share/1FYnSYK1N4/) and an Instagram button (https://www.instagram.com/george.constantin1701). Add a simple contact form (name, email, message) that opens the visitor's email app with a prefilled mailto to facemceneplace@gmail.com; no backend.
5. Footer: "#facemceneplace · © current year", the social links.

Also: sticky minimal navigation (Portofoliu, Despre, Contact) with a mobile menu, smooth anchor scrolling, SEO title "#facemceneplace — Foto și video de peste 20 de ani", Romanian meta description, Open Graph tags, accessible alt texts and focus states. Do not invent prices, packages, testimonials, addresses or phone numbers. Do not add a backend or database. The real photos will be provided later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0abf0ef-62c9-4d0c-a176-953f5ccc36d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
