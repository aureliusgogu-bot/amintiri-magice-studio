import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type CatalogItem = { id: number; title: string; category: string };

export async function recommendPhotos(description: string, catalog: CatalogItem[]) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Serviciul de recomandări nu este configurat.");

  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const list = catalog.map((p) => `${p.id}: ${p.title} (${p.category})`).join("\n");
  const result = streamText({
    model: provider.responses(MODEL),
    system:
      'Ești asistentul unui studio foto-video. Primești descrierea unui eveniment sau a unei ședințe foto și catalogul portofoliului. Alege între 3 și 6 fotografii cele mai relevante. Răspunde DOAR cu JSON de forma {"ids":[numere],"motiv":"o frază scurtă în română"}. Nu inventa prețuri, pachete sau servicii.',
    prompt: `Catalog:\n${list}\n\nDescrierea vizitatorului:\n${description}`,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = await result.text;
  const match = text.match(/\{[\s\S]*\}/);
  let parsed: { ids?: unknown; motiv?: unknown } = {};
  try {
    parsed = match ? JSON.parse(match[0]) : {};
  } catch {
    parsed = {};
  }
  const valid = new Set(catalog.map((p) => p.id));
  const ids = (Array.isArray(parsed.ids) ? parsed.ids : [])
    .map(Number)
    .filter((n) => valid.has(n))
    .slice(0, 6);
  return { ids, reason: typeof parsed.motiv === "string" ? parsed.motiv.slice(0, 300) : "" };
}
