const NCR_RANGES: [number, number][] = [
  [110001, 110097],   // Delhi
  [122001, 122108],   // Gurugram
  [122050, 122052],   // Manesar
  [122101, 122105],   // Sohna
  [121001, 121107],   // Faridabad
  [201301, 201310],   // Noida
  [201304, 201318],   // Greater Noida
  [201001, 201015],   // Ghaziabad
  [131001, 131039],   // Sonipat
  [124505, 124508],   // Bahadurgarh
];

export function isNcrPin(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-]/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  const pin = Number(cleaned);
  return NCR_RANGES.some(([lo, hi]) => pin >= lo && pin <= hi);
}

export function detectVariant(pin: string): "ncr" | "outside_ncr" | null {
  const cleaned = pin.replace(/[\s\-]/g, "");
  if (!/^\d{6}$/.test(cleaned)) return null;
  return isNcrPin(cleaned) ? "ncr" : "outside_ncr";
}
