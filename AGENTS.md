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
- Gate gallery transform animations behind desktop, hover and reduced-motion media queries; use opacity-only transitions otherwise for accessible mobile browsing.
- Keep contact submission entirely client-side through an encoded mailto URL because no backend is required.
