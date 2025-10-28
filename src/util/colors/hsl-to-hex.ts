import { hsl } from "d3-color";

export function hslToHex(h: number, s: number, l: number) {
  const color = hsl(h, s, l);
  return color.formatHex();
}