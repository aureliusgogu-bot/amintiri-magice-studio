import { describe, expect, it } from "vitest";
import { visitorReviewSchema } from "@/lib/review-schema";

describe("Visitor review validation", () => {
  const valid = { author: "  Client test  ", quote: "  O experiență frumoasă, mulțumim!  ", event: "  Nuntă  " };
  it("trims content and defaults the honeypot", () => {
    expect(visitorReviewSchema.parse(valid)).toEqual({ author: "Client test", quote: "O experiență frumoasă, mulțumim!", event: "Nuntă", website: "" });
  });
  it("rejects empty names and short reviews", () => {
    expect(visitorReviewSchema.safeParse({ ...valid, author: " " }).success).toBe(false);
    expect(visitorReviewSchema.safeParse({ ...valid, quote: "scurt" }).success).toBe(false);
  });
  it("rejects oversized values", () => {
    for (const [key, length] of [["author", 81], ["quote", 1201], ["event", 61]] as const) {
      expect(visitorReviewSchema.safeParse({ ...valid, [key]: "x".repeat(length) }).success).toBe(false);
    }
  });
});