export function glslColorToHex(color: [number, number, number]): string {
  const clampAndConvert = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    return Math.round(clamped * 255)
      .toString(16)
      .padStart(2, "0");
  };

  const [r, g, b] = color.map(clampAndConvert);
  return `#${r}${g}${b}`;
}