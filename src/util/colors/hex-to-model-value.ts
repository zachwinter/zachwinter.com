import { rgb } from "d3-color";

export function hexToModelValue(hex: string, isWebgl: boolean): any {
  if (isWebgl) {
    // Convert hex to [r, g, b] array (0-1 range)
    const color = rgb(hex);
    return [color.r / 255, color.g / 255, color.b / 255];
  } else {
    // Return hex string
    return hex;
  }
}