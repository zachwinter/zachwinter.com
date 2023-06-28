const styles = getComputedStyle(document.documentElement)

export function px(pixels: number): number {
  const ref = parseFloat(styles.getPropertyValue('--viewport-reference'))
  const scale = parseFloat(styles.getPropertyValue('--viewport-scale'))
  const width = parseFloat(styles.getPropertyValue('--viewport-width'))
  return pixels * (width / ref) * scale
}
