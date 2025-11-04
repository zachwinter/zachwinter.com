/**
 * Sprite Renderer Worker
 *
 * Renders map sprites using OffscreenCanvas to keep the main thread responsive.
 * This eliminates 300ms+ blocking during initialization.
 */

import * as topojson from 'topojson-client'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { scaleLinear } from 'd3-scale'

const TWO_PI = Math.PI * 2

const COLORS = {
  countyFill: '#1B0B1C',
  countyStroke: '#996699',
  stateStroke: '#996699',
  nationStroke: '#996699',
  pointColor: '#E80040',
  pointShadow: '#0F0611'
}

interface RenderMapSpriteMessage {
  type: 'render-map'
  id: string
  width: number
  height: number
  usa: any
}

interface RenderDatumSpriteMessage {
  type: 'render-datum'
  id: string
  size: number
}

type WorkerMessage = RenderMapSpriteMessage | RenderDatumSpriteMessage

// Message handler
self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const message = e.data

  try {
    if (message.type === 'render-map') {
      await renderMapSprite(message)
    } else if (message.type === 'render-datum') {
      await renderDatumSprite(message)
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
 * Render the map sprite (counties, states, nation)
 */
async function renderMapSprite(message: RenderMapSpriteMessage) {
  const { id, width, height, usa } = message

  // Create OffscreenCanvas
  const canvas = new OffscreenCanvas(width * 2, height * 2)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2d context from OffscreenCanvas')
  }

  // Build projection (D3 projections can't be serialized, must rebuild in worker)
  const projection = geoAlbersUsa().fitExtent(
    [
      [20, 50],
      [width - 20, height - 50]
    ],
    topojson.feature(usa, usa.objects.nation)
  )

  // Calculate line widths based on viewport
  const featureScale = scaleLinear([0, 1920], [0, 5])
  const lineWidthThin = featureScale(width) / 10
  const lineWidthThick = featureScale(width) / 3

  // Render at 2x for retina
  ctx.scale(2, 2)

  // Draw counties
  ctx.lineWidth = lineWidthThin
  ctx.fillStyle = COLORS.countyFill
  ctx.strokeStyle = COLORS.countyStroke
  ctx.beginPath()
  const path = geoPath(projection, ctx as any)
  path(topojson.feature(usa, usa.objects.counties))
  ctx.fill()
  ctx.stroke()

  // Draw state borders
  ctx.lineWidth = lineWidthThick
  ctx.strokeStyle = COLORS.stateStroke
  ctx.beginPath()
  path(topojson.mesh(usa, usa.objects.states))
  ctx.stroke()

  // Draw nation border
  ctx.lineWidth = lineWidthThick
  ctx.strokeStyle = COLORS.nationStroke
  ctx.beginPath()
  path(topojson.mesh(usa, usa.objects.nation))
  ctx.stroke()

  // Transfer to ImageBitmap (zero-copy transfer)
  const bitmap = canvas.transferToImageBitmap()

  // Send back to main thread
  self.postMessage(
    {
      type: 'sprite-ready',
      id,
      bitmap,
      width: canvas.width,
      height: canvas.height
    },
    [bitmap] // Transfer ownership
  )
}

/**
 * Render the datum sprite (point marker)
 */
async function renderDatumSprite(message: RenderDatumSpriteMessage) {
  const { id, size } = message

  // Create OffscreenCanvas
  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2d context from OffscreenCanvas')
  }

  // Draw point
  ctx.fillStyle = COLORS.pointColor
  ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
  ctx.shadowBlur = size / 1.5
  ctx.shadowColor = COLORS.pointShadow
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 4, 0, TWO_PI)
  ctx.fill()

  // Transfer to ImageBitmap
  const bitmap = canvas.transferToImageBitmap()

  // Send back to main thread
  self.postMessage(
    {
      type: 'sprite-ready',
      id,
      bitmap,
      width: canvas.width,
      height: canvas.height
    },
    [bitmap] // Transfer ownership
  )
}

// Notify main thread that worker is ready
self.postMessage({ type: 'ready' })
