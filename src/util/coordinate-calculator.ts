/**
 * Coordinate Calculator - Progressive Enhancement
 *
 * Offloads D3 projection building and coordinate calculations to a worker
 * when available, with automatic fallback to main thread.
 */

import { supportsWorkers } from './feature-detection'
import * as topojson from 'topojson-client'
import { geoAlbersUsa, type GeoProjection } from 'd3-geo'

export interface Location {
  lon: number
  lat: number
}

/**
 * Calculate datum coordinates using the best available method
 *
 * @returns Array of [x, y] coordinates (or null for invalid projections)
 */
export async function calculateCoordinatesOptimized(
  width: number,
  height: number,
  usa: any,
  locations: Location[]
): Promise<([number, number] | null)[]> {
  // Check for worker support
  if (supportsWorkers()) {
    console.log('[CoordinateCalculator] Using worker-based calculation')
    return calculateCoordinatesWorker(width, height, usa, locations)
  } else {
    console.log('[CoordinateCalculator] Using main thread calculation (fallback)')
    return calculateCoordinatesMainThread(width, height, usa, locations)
  }
}

/**
 * Worker-based coordinate calculation
 */
async function calculateCoordinatesWorker(
  width: number,
  height: number,
  usa: any,
  locations: Location[]
): Promise<([number, number] | null)[]> {
  return new Promise((resolve, reject) => {
    // Create worker
    const worker = new Worker(
      new URL('../workers/coordinate-calculator.worker.ts', import.meta.url),
      { type: 'module' }
    )

    const timeout = setTimeout(() => {
      worker.terminate()
      reject(new Error('Worker timeout'))
    }, 30000) // 30s timeout

    worker.addEventListener('message', (e) => {
      const message = e.data

      if (message.type === 'ready') {
        // Worker initialized, request coordinates
        worker.postMessage({
          type: 'calculate',
          id: 'coords',
          width,
          height,
          usa,
          locations
        })
      } else if (message.type === 'coordinates-ready') {
        clearTimeout(timeout)
        worker.terminate()

        // Convert Float32Array back to array of tuples
        const { coords, numLocations } = message
        const result: ([number, number] | null)[] = []

        for (let i = 0; i < numLocations; i++) {
          const x = coords[i * 2]
          const y = coords[i * 2 + 1]

          // Check for NaN (invalid projection)
          if (Number.isNaN(x) || Number.isNaN(y)) {
            result.push(null)
          } else {
            result.push([x, y])
          }
        }

        resolve(result)
      } else if (message.type === 'error') {
        clearTimeout(timeout)
        worker.terminate()
        reject(new Error(`Worker error: ${message.error}`))
      }
    })

    worker.addEventListener('error', (error) => {
      clearTimeout(timeout)
      worker.terminate()
      reject(error)
    })
  })
}

/**
 * Main thread coordinate calculation (fallback)
 */
function calculateCoordinatesMainThread(
  width: number,
  height: number,
  usa: any,
  locations: Location[]
): Promise<([number, number] | null)[]> {
  // Build projection
  const projection = geoAlbersUsa().fitExtent(
    [
      [20, 50],
      [width - 20, height - 50]
    ],
    topojson.feature(usa, usa.objects.nation)
  )

  // Calculate coordinates
  const coordinates: ([number, number] | null)[] = []

  for (let i = 0; i < locations.length; i++) {
    const coords = projection([locations[i].lon, locations[i].lat])
    coordinates.push(coords)
  }

  return Promise.resolve(coordinates)
}

/**
 * Build projection on main thread (still needed for some operations)
 */
export function buildProjectionSync(width: number, height: number, usa: any): GeoProjection | null {
  if (!usa?.objects?.nation) return null

  try {
    return geoAlbersUsa().fitExtent(
      [
        [20, 50],
        [width - 20, height - 50]
      ],
      topojson.feature(usa, usa.objects.nation)
    )
  } catch (e) {
    console.warn('Failed to build projection:', e)
    return null
  }
}
