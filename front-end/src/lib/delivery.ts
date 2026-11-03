export const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard · 1–2 days" },
  { id: "same-day", label: "Same-day · today" },
] as const;

export type DeliveryOptionId = (typeof DELIVERY_OPTIONS)[number]["id"];

export const DEFAULT_DELIVERY_OPTION: DeliveryOptionId = "standard";

export const FREE_DELIVERY_THRESHOLD = 25000;

export function deliveryFeeFor(subtotal: number, option: DeliveryOptionId): number {
  if (option === "same-day") return 3000;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 1500;
}

export function deliveryLabelFor(option: DeliveryOptionId): string {
  const found = DELIVERY_OPTIONS.find((o) => o.id === option);
  return found?.label ?? "Standard · 1–2 days";
}
