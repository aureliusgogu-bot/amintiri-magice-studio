import { describe, expect, it } from "vitest";
import { agentNotFoundResponse, prefersMarkdown } from "@/lib/agent-response";

const html404 = () => new Response("<h1>404</h1>", { status: 404, headers: { "Content-Type": "text/html", Vary: "Accept-Encoding" } });
describe("Agent 404 negotiation", () => {
  it("returns a Markdown explanation with links and the original 404 status", async () => {
    const response = agentNotFoundResponse(new Request("https://facemceneplace.com/missing", { headers: { Accept: "text/markdown" } }), html404());
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("vary")).toBe("Accept-Encoding, Accept");
    const body = await response.text();
    expect(body.length).toBeGreaterThan(20);
    expect(body).toContain("[Harta site-ului](/sitemap.xml)");
  });
  it("keeps ordinary browser errors as HTML and varies on Accept", async () => {
    const response = agentNotFoundResponse(new Request("https://facemceneplace.com/missing", { headers: { Accept: "text/html" } }), html404());
    expect(await response.text()).toBe("<h1>404</h1>");
    expect(response.headers.get("content-type")).toBe("text/html");
    expect(response.headers.get("vary")).toContain("Accept");
  });
  it("does not convert successful pages, private errors or missing API/image responses", () => {
    const request = new Request("https://facemceneplace.com/missing", { headers: { Accept: "text/markdown" } });
    for (const response of [new Response("ok"), new Response("denied", { status: 403 }), new Response("{}", { status: 404, headers: { "Content-Type": "application/json" } })]) {
      expect(agentNotFoundResponse(request, response)).toBe(response);
    }
  });
  it("honors disabled or lower-priority Markdown and keeps HEAD body empty", async () => {
    expect(prefersMarkdown("text/markdown;q=0, text/html")).toBe(false);
    expect(prefersMarkdown("text/markdown;q=0.5, text/html;q=0.9")).toBe(false);
    expect(prefersMarkdown("text/markdown;q=0.9, text/html;q=0.5")).toBe(true);
    const response = agentNotFoundResponse(new Request("https://facemceneplace.com/missing", { method: "HEAD", headers: { Accept: "text/markdown" } }), html404());
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });
});