import { rgb } from "d3-color";

export function modelValueToHex(value: any, isWebgl: boolean): string {
  if (!value) return "#000000";

  if (isWebgl) {
    // Convert [r, g, b] array (0-1 range) to hex
    const [r, g, b] = value;
    const rgbColor = rgb(r * 255, g * 255, b * 255);
    return rgbColor.formatHex();
  } else {
    // Already a hex string
    return value;
  }
}