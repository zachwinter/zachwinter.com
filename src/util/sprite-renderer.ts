/**
 * Sprite Renderer - Progressive Enhancement
 *
 * Abstracts sprite rendering to use OffscreenCanvas workers when available,
 * with automatic fallback to main thread rendering.
 */

import { supportsWorkerSprites } from './feature-detection'
import Sprite, { type SpriteOptions } from '../classes/Sprite'
import * as topojson from 'topojson-client'
import { geoAlbersUsa, geoPath, type GeoProjection } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { TWO_PI } from './canvas'

const COLORS = {
  countyFill: '#1B0B1C',
  countyStroke: '#996699',
  stateStroke: '#996699',
  nationStroke: '#996699',
  pointColor: '#E80040',
  pointShadow: '#0F0611'
}

export interface SpriteRenderResult {
  map: Sprite
  datum: Sprite
}

/**
 * Build sprites using the best available method
 */
export async function buildSpritesOptimized(
  width: number,
  height: number,
  usa: any,
  projection: GeoProjection | null
): Promise<SpriteRenderResult> {
  // Check for worker support
  if (supportsWorkerSprites()) {
    console.log('[SpriteRenderer] Using worker-based rendering (OffscreenCanvas)')
    return buildSpritesWorker(width, height, usa, projection)
  } else {
    console.log('[SpriteRenderer] Using main thread rendering (fallback)')
    return buildSpritesMainThread(width, height, usa, projection)
  }
}

/**
 * Worker-based sprite rendering (OffscreenCanvas)
 */
async function buildSpritesWorker(
  width: number,
  height: number,
  usa: any,
  projection: GeoProjection | null
): Promise<SpriteRenderResult> {
  return new Promise((resolve, reject) => {
    // Create worker
    const worker = new Worker(new URL('../workers/sprite-renderer.worker.ts', import.meta.url), {
      type: 'module'
    })

    const sprites: Partial<SpriteRenderResult> = {}
    let mapReady = false
    let datumReady = false

    const checkComplete = () => {
      if (mapReady && datumReady) {
        worker.terminate()
        resolve(sprites as SpriteRenderResult)
      }
    }

    worker.addEventListener('message', (e) => {
      const message = e.data

      if (message.type === 'ready') {
        // Worker initialized, request sprites
        worker.postMessage({
          type: 'render-map',
          id: 'map',
          width,
          height,
          usa
        })

        worker.postMessage({
          type: 'render-datum',
          id: 'datum',
          size: 125 // POINT_SIZE
        })
      } else if (message.type === 'sprite-ready') {
        // Received sprite from worker
        const { id, bitmap, width, height } = message

        if (id === 'map') {
          sprites.map = Sprite.fromImageBitmap(bitmap, width, height)
          mapReady = true
          checkComplete()
        } else if (id === 'datum') {
          sprites.datum = Sprite.fromImageBitmap(bitmap, width, height)
          datumReady = true
          checkComplete()
        }
      } else if (message.type === 'error') {
        worker.terminate()
        reject(new Error(`Worker error: ${message.error}`))
      }
    })

    worker.addEventListener('error', (error) => {
      worker.terminate()
      reject(error)
    })
  })
}

/**
 * Main thread sprite rendering (fallback)
 */
function buildSpritesMainThread(
  width: number,
  height: number,
  usa: any,
  projection: GeoProjection | null
): Promise<SpriteRenderResult> {
  const featureScale = scaleLinear([0, 1920], [0, 5])

  const map: SpriteOptions = {
    width: width * 2,
    height: height * 2,
    paint({ ctx }) {
      ctx.scale(2, 2)
      ctx.lineWidth = featureScale(width) / 10
      ctx.fillStyle = COLORS.countyFill
      ctx.strokeStyle = COLORS.countyStroke
      ctx.beginPath()
      const path = geoPath(projection!, ctx as any)
      path(topojson.feature(usa, usa.objects.counties))
      ctx.fill()
      ctx.stroke()
      ctx.lineWidth = featureScale(width) / 3
      ctx.strokeStyle = COLORS.stateStroke
      ctx.beginPath()
      path(topojson.mesh(usa, usa.objects.states))
      ctx.stroke()
      ctx.lineWidth = featureScale(width) / 3
      ctx.strokeStyle = COLORS.nationStroke
      ctx.beginPath()
      path(topojson.mesh(usa, usa.objects.nation))
      ctx.stroke()
    }
  }

  const datum: SpriteOptions = {
    width: 125,
    height: 125,
    paint({ ctx }) {
      ctx.fillStyle = COLORS.pointColor
      ctx.strokeStyle = 'rgba(0, 0, 0, 1'
      ctx.shadowBlur = 125 / 1.5
      ctx.shadowColor = COLORS.pointShadow
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(125 / 2, 125 / 2, 125 / 4, 0, TWO_PI)
      ctx.fill()
    }
  }

  return Promise.resolve({
    map: new Sprite(map),
    datum: new Sprite(datum)
  })
}
