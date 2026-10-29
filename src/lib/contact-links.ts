export const WHATSAPP_GREETING = "Bună! Vă scriu de pe site despre un eveniment.";

/** WhatsApp chat link for a Romanian phone such as "0727113893" (leading 0 dropped, +40 added). */
export function whatsappHref(phone: string | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const national = digits.startsWith("40") ? digits.slice(2) : digits.replace(/^0/, "");
  return `https://wa.me/40${national}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
}
