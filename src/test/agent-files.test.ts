import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { agentRenderRequest } from "@/lib/agent-response";
import { trustPageHead, trustPages } from "@/lib/trust-pages";

describe("Public agent discovery protocols", () => {
  it("provides flat llms.txt with safe public links and Optional last", () => {
    const file = readFileSync("public/llms.txt", "utf8");
    expect(file.split("\n").filter((line) => /^# /.test(line))).toHaveLength(1);
    expect(file).not.toMatch(/^###/m);
    expect(file.match(/^## .+$/gm)?.at(-1)).toBe("## Optional");
    const paths = [...file.matchAll(/^- \[[^\]]+\]\(([^)]+)\): .+$/gm)].map((match) => match[1]);
    expect(paths).toEqual(expect.arrayContaining(["/", "/about", "/contact", "/privacy", "/recenzii", "/sitemap.xml"]));
    expect(paths.every((path) => ["/", "/about", "/contact", "/privacy", "/recenzii", "/sitemap.xml"].includes(path ?? ""))).toBe(true);
  });
  it("requests HTML internally only for safe Markdown page requests", () => {
    const request = new Request("https://facemceneplace.com/missing", { headers: { Accept: "text/markdown" } });
    expect(agentRenderRequest(request).headers.get("accept")).toBe("text/html");
    expect(request.headers.get("accept")).toBe("text/markdown");
    const post = new Request(request.url, { method: "POST", headers: request.headers });
    expect(agentRenderRequest(post)).toBe(post);
  });
  it("gives each trust endpoint a unique self-referencing canonical and machine metadata", () => {
    const titles = new Set<string>();
    for (const key of ["about", "contact", "privacy"] as const) {
      const head = trustPageHead(key);
      expect(head.links[0]?.href).toBe(`https://facemceneplace.com${trustPages[key].path}`);
      expect(head.meta).toContainEqual({ property: "og:type", content: "website" });
      expect(head.meta).toContainEqual({ property: "og:locale", content: "ro_RO" });
      expect(JSON.parse(head.scripts[0]?.children ?? "{}").url).toBe(head.links[0]?.href);
      titles.add(trustPages[key].title);
    }
    expect(titles.size).toBe(3);
  });
});