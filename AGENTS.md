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
- Store replaceable photo data at the top of the gallery module and import CDN asset pointers for small and large renditions to keep the page fast and replacement simple.
- Gate all photo and gallery transform animations through the shared desktop/hover/reduced-motion hook; use opacity-only transitions otherwise for accessible mobile browsing.
- Use clipped reusable parallax photo frames and native passive pointer tracking without wheel/drag interception so images stay covered and page scrolling remains available.
- Keep contact submission entirely client-side through an encoded mailto URL because no backend is required.
- Serve the sitemap from the server route `src/routes/sitemap[.]xml.ts` with `BASE_URL` set to the live public origin, and give every route an explicit `staticData.sitemap` decision, so the XML follows the router without a build-time sitemap plugin that would shadow it.
- Build JSON-LD image entries from the images the page already renders, resolved against a single `SITE_ORIGIN` constant, and never add business facts the user has not supplied (street address, geo, opening hours, prices, packages).
- Run portfolio recommendations through a createServerFn that calls Lovable AI server-side with only photo titles/categories, so the key stays private and results map back to the local photos array.
