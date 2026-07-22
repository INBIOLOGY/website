// Helper utilities for pricing and formatting

export function formatPrice(n) {
  return Number(n).toLocaleString('th-TH');
}

export function pct(orig, cur) {
  if (!orig || orig <= 0) return 0;
  return Math.round((1 - cur / orig) * 100);
}
