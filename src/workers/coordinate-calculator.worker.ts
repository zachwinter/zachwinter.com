/**
 * Coordinate Calculator Worker
 *
 * Offloads D3 projection building and 3000+ coordinate calculations
 * from the main thread. Eliminates 26ms+ blocking during initialization.
 */

import * as topojson from 'topojson-client'
import { geoAlbersUsa } from 'd3-geo'

interface CalculateCoordinatesMessage {
  type: 'calculate'
  id: string
  width: number
  height: number
  usa: any
  locations: Array<{ lon: number; lat: number }>
}

type WorkerMessage = CalculateCoordinatesMessage

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const message = e.data

  try {
    if (message.type === 'calculate') {
      await calculateCoordinates(message)
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: message.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Build projection and calculate all datum coordinates
 */
async function calculateCoordinates(message: CalculateCoordinatesMessage) {
  const { id, width, height, usa, locations } = message

  // Build projection (this is the 26ms blob we're eliminating)
  const projection = geoAlbersUsa().fitExtent(
    [
      [20, 50],
      [width - 20, height - 50]
    ],
    topojson.feature(usa, usa.objects.nation)
  )

  // Calculate all coordinates (3000+ projections)
  // Store as flat Float32Array for efficient transfer: [x1, y1, x2, y2, ...]
  const numLocations = locations.length
  const coords = new Float32Array(numLocations * 2)

  for (let i = 0; i < numLocations; i++) {
    const location = locations[i]
    const projected = projection([location.lon, location.lat])

    if (projected) {
      coords[i * 2] = projected[0]
      coords[i * 2 + 1] = projected[1]
    } else {
      // Mark as invalid with NaN
      coords[i * 2] = NaN
      coords[i * 2 + 1] = NaN
    }
  }

  // Send back to main thread (transfer ownership of ArrayBuffer)
  self.postMessage(
    {
      type: 'coordinates-ready',
      id,
      coords,
      numLocations
    },
    [coords.buffer]
  )
}

// Notify main thread that worker is ready
self.postMessage({ type: 'ready' })
