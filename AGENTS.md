<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep the portfolio as one anchor-navigated index route because its sections belong to the requested single scrolling experience.
- Keep the bundled photo array at the top of the gallery module only as the fallback for when the database is unreachable or empty, so the site never looks empty.
- Site content (photos, reviews, contact details) lives in Lovable Cloud tables edited from the private `/admin` route; the index loader reads it through the public `getSiteData` server function and falls back to bundled defaults, so the owner can update the site without code.
- Gate every admin write (tables and the private `portfolio` bucket) with the `is_admin()` security-definer check against the verified email in `admin_emails`, because signing up must never grant access.
- Store visitor reviews in the private `review_submissions` queue via a validated public server function and insert-only database RPC; only verified admins may read/reject them or atomically approve them into `reviews`, so unmoderated text never appears publicly.
- Keep review presentation and submission UI in the preview-only `src/features/reviews/` folder, excluded from library attach; the homepage carousel and `/recenzii` both use approved reviews from `getSiteData`, preserving the moderation system.
- Serve portfolio images through the `/foto/$` server route from the private bucket, because the workspace blocks public buckets.
- Resize and re-encode uploads in the browser (small ≈800px, large ≈1800px JPEG) before storing them, so files stay light and EXIF/GPS data is stripped.
- Gate all photo and gallery transform animations through the shared desktop/hover/reduced-motion hook; use opacity-only transitions otherwise for accessible mobile browsing.
- Use clipped reusable parallax photo frames and native passive pointer tracking without wheel/drag interception so images stay covered and page scrolling remains available.
- Keep contact submission entirely client-side through an encoded mailto URL because no backend is required.
- Render the studio footer logo at its intrinsic aspect ratio with a constrained width and no blur/glow filters; derive transparent exports from the preserved uploaded original rather than regenerating brand artwork.
- Serve the sitemap from the server route `src/routes/sitemap[.]xml.ts` with `BASE_URL` set to the live public origin, and give every route an explicit `staticData.sitemap` decision, so the XML follows the router without a build-time sitemap plugin that would shadow it.
- Keep confirmed business facts and the public origin in the shared site SEO module; build homepage JSON-LD from loader settings and the effective database-or-fallback gallery so search data matches displayed content, and never invent business facts or coordinates.
- Run portfolio recommendations through a createServerFn that calls Lovable AI server-side with only photo titles/categories, so the key stays private and results map back to the local photos array.
- Ship bundled photos as WebP with small/large srcset, the hero via preloaded CDN WebP variants, and fonts self-hosted from `src/assets/fonts`, because render-blocking Google Fonts and JPEGs dominated mobile load time.
- Cache `getSiteData` in memory for 60s per server instance so page views don't each hit the database while admin edits still appear within a minute.
