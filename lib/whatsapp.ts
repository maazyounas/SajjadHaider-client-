const DEFAULT_WHATSAPP_NUMBER = "923212954720";
export const DEFAULT_WHATSAPP_PREFILL =
  "Hi! I'm interested in enrolling at SH Academy. Could you please share more details?";

export function buildWhatsAppHref(
  number?: string,
  message: string = DEFAULT_WHATSAPP_PREFILL,
) {
  const cleanNumber = (number || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
