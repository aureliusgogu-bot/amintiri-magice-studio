import { describe, expect, it } from "vitest";
import { whatsappHref } from "@/lib/contact-links";

describe("whatsappHref", () => {
  it("drops the leading 0 and prefixes 40", () => {
    expect(whatsappHref("0727113893")).toBe(
      "https://wa.me/40727113893?text=" + encodeURIComponent("Bună! Vă scriu de pe site despre un eveniment."),
    );
  });
  it("returns null without a phone", () => {
    expect(whatsappHref(undefined)).toBeNull();
  });
});
