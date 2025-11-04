/**
 * Feature detection utilities for progressive enhancement
 */

/**
 * Check if OffscreenCanvas is supported
 *
 * Browser support:
 * - Chrome 69+ (Sept 2018)
 * - Firefox 105+ (Sept 2022)
 * - Safari 16.4+ (March 2023)
 */
export function supportsOffscreenCanvas(): boolean {
  if (typeof window === 'undefined') return false

  try {
    // Check if OffscreenCanvas constructor exists
    if (typeof OffscreenCanvas === 'undefined') return false

    // Try to create an instance
    const canvas = new OffscreenCanvas(1, 1)
    const ctx = canvas.getContext('2d')

    // Check if we can get a context and transfer to ImageBitmap
    return ctx !== null && typeof canvas.transferToImageBitmap === 'function'
  } catch (e) {
    return false
  }
}

/**
 * Check if Workers are supported
 */
export function supportsWorkers(): boolean {
  return typeof Worker !== 'undefined'
}

/**
 * Check if we can use worker-based sprite rendering
 * Requires both OffscreenCanvas and Workers
 */
export function supportsWorkerSprites(): boolean {
  return supportsWorkers() && supportsOffscreenCanvas()
}

/**
 * Get a user-friendly description of sprite rendering mode
 */
export function getSpriteRenderingMode(): { mode: 'worker' | 'main', description: string } {
  if (supportsWorkerSprites()) {
    return {
      mode: 'worker',
      description: 'Using worker-based sprite rendering (OffscreenCanvas)'
    }
  }

  return {
    mode: 'main',
    description: 'Using main thread sprite rendering (fallback)'
  }
}
