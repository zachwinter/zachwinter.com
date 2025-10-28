export function hexToGlslColor(hex: string): [number, number, number] {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length !== 6) {
    throw new Error("Invalid hex color format. Expected a 6-character string.");
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return [r, g, b];
}