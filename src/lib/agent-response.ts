/** Honor explicit Markdown negotiation; normal browsers keep their HTML 404. */
export function prefersMarkdown(accept: string | null): boolean {
  const quality = (type: string) => {
    const matches = (accept ?? "").split(",").map((part) => {
      const [media, ...parameters] = part.trim().toLowerCase().split(";");
      const q = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return { media: media?.trim(), q: q ? Number(q.trim().slice(2)) : 1 };
    }).filter((entry) => entry.media === type);
    return Math.max(0, ...matches.map((entry) => Number.isFinite(entry.q) && entry.q <= 1 ? entry.q : 0));
  };
  return quality("text/markdown") > 0 && quality("text/markdown") >= quality("text/html");
}

/** Start's page renderer rejects non-HTML Accept; negotiate after it resolves status. */
export function agentRenderRequest(request: Request): Request {
  if (!["GET", "HEAD"].includes(request.method) || !prefersMarkdown(request.headers.get("accept"))) return request;
  const headers = new Headers(request.headers);
  headers.set("Accept", "text/html");
  // Construct from the URL: the dev adapter may supply a different Request realm.
  return new Request(request.url, { method: request.method, headers, signal: request.signal });
}

export function agentNotFoundResponse(request: Request, response: Response): Response {
  if (response.status !== 404 || !["GET", "HEAD"].includes(request.method) ||
      !response.headers.get("content-type")?.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  const vary = headers.get("vary")?.split(",").map((item) => item.trim()) ?? [];
  if (!vary.some((item) => item.toLowerCase() === "accept") && !vary.includes("*")) vary.push("Accept");
  headers.set("Vary", vary.join(", "));
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return new Response(response.body, { status: 404, headers });
  }
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("etag");
  headers.set("Cache-Control", "no-store");
  const body = "# 404 — Pagina nu a fost găsită\n\nPagina solicitată nu există pe site-ul #facemceneplace. Consultă paginile publice înainte de a recomanda un link.\n\n- [Ghid pentru asistenți AI](/llms.txt)\n- [Harta site-ului](/sitemap.xml)\n- [Pagina principală](/)\n";
  return new Response(request.method === "HEAD" ? null : body, { status: 404, headers });
}