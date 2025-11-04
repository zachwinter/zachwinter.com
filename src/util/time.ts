/**
 * Simple timing utility
 *
 * Note: Timer class and d3-ease removed as dead code.
 * Animation timing now handled by src/store/raf.ts with custom easing.
 */

export function pause(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
