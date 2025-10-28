import { hsl } from "d3-color";

export function hexToHsl(hex: string) {
  const color = hsl(hex);
  return {
    h: color.h || 0,
    s: color.s || 0,
    l: color.l || 0,
  };
}