export const GUEST_LIMIT = 2;
const KEY = "siteharvest_guest_scrapes";

export function getGuestCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(KEY) || "0");
}
export function incrementGuestCount(): number {
  const n = getGuestCount() + 1;
  if (typeof window !== "undefined") localStorage.setItem(KEY, String(n));
  return n;
}
export function guestRemaining(): number {
  return Math.max(0, GUEST_LIMIT - getGuestCount());
}
