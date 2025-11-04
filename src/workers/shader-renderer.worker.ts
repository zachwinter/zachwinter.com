/**
 * Shader Renderer Worker
 *
 * Offloads WebGL shader rendering to a worker thread using OffscreenCanvas.
 * Keeps main thread buttery smooth at 60fps!
 */

import { GLSL_UTILS } from '../fragment-shader/constants/glsl'
import {
  DEFAULT_DEFS,
  DEFAULT_UNIFORM_DECLARATIONS,
  DEFAULT_VERTEX_SHADER,
  SHADER_TYPE_MAP,
  WEBGL_TYPE_MAP
} from '../fragment-shader/constants/shader'

// Worker-safe internal uniforms (no window access!)
const WORKER_INTERNAL_UNIFORMS = [
  ['time', 0, [0, 0, 1, 0.001]],
  ['stream', 0, [0, 0, 1, 0.001]],
  ['resolution', 2, [1920, 1080]], // Will be set properly on init
  ['volume', 0, [1, 0, 1, 0.001]],
  ['scroll', 0, [0, 0, 1, 0.001]]
] as any

// Worker-safe uniform declarations (no window access!)
const WORKER_UNIFORM_DECLARATIONS = WORKER_INTERNAL_UNIFORMS.reduce((acc: string, uniform: any) => {
  const key = uniform[0]
  const type = uniform[1] as any
  acc += `uniform ${SHADER_TYPE_MAP[type]} ${key};\n`
  return acc
}, '')

interface InitMessage {
  type: 'init'
  id: string
  canvas: OffscreenCanvas
  shader: string
  uniforms: any[]
  width: number
  height: number
  dpr: number
}

interface UpdateUniformsMessage {
  type: 'update-uniforms'
  id: string
  uniforms: any[]
}

interface UpdateStreamVolumeMessage {
  type: 'update-stream-volume'
  id: string
  stream: number
  volume: number
}

interface ResizeMessage {
  type: 'resize'
  id: string
  width: number
  height: number
  dpr: number
}

interface StartMessage {
  type: 'start'
  id: string
}

interface StopMessage {
  type: 'stop'
  id: string
}

type WorkerMessage =
  | InitMessage
  | UpdateUniformsMessage
  | UpdateStreamVolumeMessage
  | ResizeMessage
  | StartMessage
  | StopMessage

// Worker state
let ctx: WebGL2RenderingContext | null = null
let program: WebGLProgram | null = null
let uniformLocations: Record<string, WebGLUniformLocation | null> = {}
let uniformValues: Record<string, any> = {}
let rafId: number | null = null
let active = false
let currentShader = ''
let currentUniforms: any[] = []
let stream = 0
let volume = 1

// Vertex buffer for fullscreen quad
let vertexBuffer: WebGLBuffer | null = null

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const message = e.data

  try {
    switch (message.type) {
      case 'init':
        await initShader(message)
        break
      case 'update-uniforms':
        updateUniforms(message)
        break
      case 'update-stream-volume':
        stream = message.stream
        volume = message.volume
        break
      case 'resize':
        resize(message)
        break
      case 'start':
        start()
        break
      case 'stop':
        stop()
        break
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: message.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

function getUniformDeclarations(uniforms: any[]): string {
  return uniforms.reduce((acc, [name, type]) => {
    acc += `uniform ${SHADER_TYPE_MAP[type]} ${name};\n`
    if (type === 1) {
      acc += `uniform ${SHADER_TYPE_MAP[1]} ${name}Tween;\n`
      acc += `uniform ${SHADER_TYPE_MAP[0]} ${name}TweenProgress;\n`
    }
    return acc
  }, '')
}

function getFragmentShader(shader: string, uniforms: any[]): string {
  return `
${DEFAULT_DEFS}
${WORKER_UNIFORM_DECLARATIONS}
${getUniformDeclarations(uniforms)}
${GLSL_UTILS}
${shader}`
}

function getVertexShader(uniforms: any[]): string {
  return `
${DEFAULT_DEFS}
${WORKER_UNIFORM_DECLARATIONS}
${getUniformDeclarations(uniforms)}
${GLSL_UTILS}
${DEFAULT_VERTEX_SHADER}`
}

function compileShader(type: number, source: string): WebGLShader | null {
  if (!ctx) return null

  const shader = ctx.createShader(type)
  if (!shader) return null

  ctx.shaderSource(shader, source)
  ctx.compileShader(shader)

  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    const info = ctx.getShaderInfoLog(shader)
    console.error('[ShaderWorker] Shader compilation failed:', info)
    ctx.deleteShader(shader)
    return null
  }

  return shader
}

async function initShader(message: InitMessage) {
  const { id, canvas, shader, uniforms, width, height, dpr } = message

  // Initialize WebGL context
  ctx = canvas.getContext('webgl2') as WebGL2RenderingContext
  if (!ctx) {
    throw new Error('WebGL2 not supported in worker')
  }

  currentShader = shader
  currentUniforms = uniforms

  // Create program
  program = ctx.createProgram()
  if (!program) throw new Error('Failed to create program')

  // Compile shaders
  const vertexShader = compileShader(ctx.VERTEX_SHADER, getVertexShader(uniforms))
  const fragmentShader = compileShader(ctx.FRAGMENT_SHADER, getFragmentShader(shader, uniforms))

  if (!vertexShader || !fragmentShader) {
    throw new Error('Shader compilation failed')
  }

  ctx.attachShader(program, vertexShader)
  ctx.attachShader(program, fragmentShader)
  ctx.linkProgram(program)

  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    const info = ctx.getProgramInfoLog(program)
    throw new Error(`Program linking failed: ${info}`)
  }

  ctx.useProgram(program)

  // Create vertex buffer for fullscreen quad
  vertexBuffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer)
  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    ctx.STATIC_DRAW
  )

  const positionLocation = ctx.getAttribLocation(program, 'position')
  ctx.enableVertexAttribArray(positionLocation)
  ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0)

  // Get uniform locations
  const allUniforms = [...WORKER_INTERNAL_UNIFORMS, ...uniforms]
  uniformLocations = {}
  uniformValues = {}

  allUniforms.forEach(([name]: any) => {
    uniformLocations[name] = ctx!.getUniformLocation(program!, name)
    if (!uniformLocations[name]) {
      console.warn(`[ShaderWorker] Could not find uniform: ${name}`)
    }
  })

  // Initialize uniform values
  uniforms.forEach(([name, type, value]: any) => {
    uniformValues[name] = { type, value }
  })

  // Set viewport
  ctx.viewport(0, 0, width * dpr, height * dpr)

  console.log('[ShaderWorker] Initialized successfully')
  self.postMessage({ type: 'ready', id })

  // Start rendering
  start()
}

function updateUniforms(message: UpdateUniformsMessage) {
  // Update uniform values in local cache
  message.uniforms.forEach(([name, type, value]: any) => {
    // Only update if the uniform exists in our map
    if (uniformLocations[name] !== undefined) {
      uniformValues[name] = { type, value }
    }
  })
}

function resize(message: ResizeMessage) {
  if (!ctx) return
  const { width, height, dpr } = message
  ctx.viewport(0, 0, width * dpr, height * dpr)
}

function setUniform(name: string, type: number, value: any) {
  if (!ctx || !uniformLocations[name]) return

  const location = uniformLocations[name]
  const suffix = WEBGL_TYPE_MAP[type]
  const method = `uniform${suffix}` as any

  try {
    if (type === 0 || type === 1) {
      // float or bool
      ;(ctx as any)[method](location, value)
    } else {
      // vec2, vec3, vec4
      ;(ctx as any)[method](location, value)
    }
  } catch (e) {
    console.warn(`[ShaderWorker] Error setting uniform ${name}:`, e)
  }
}

function tick(now: DOMHighResTimeStamp) {
  if (!ctx || !program || !active) return

  const time = now / 1000

  // Set internal uniforms
  setUniform('resolution', 2, [ctx.canvas.width, ctx.canvas.height])
  setUniform('time', 0, time)
  setUniform('stream', 0, stream || time)
  setUniform('volume', 0, volume)

  // Set user uniforms
  Object.entries(uniformValues).forEach(([name, { type, value }]) => {
    const actualValue = type === 0 ? (Array.isArray(value) ? value[0] : value) : value
    setUniform(name, type, actualValue)
  })

  // Render
  ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4)

  // Continue loop
  if (active) {
    rafId = requestAnimationFrame(tick)
  }
}

function start() {
  if (active) return
  active = true
  rafId = requestAnimationFrame(tick)
  console.log('[ShaderWorker] Started rendering loop')
}

function stop() {
  active = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  console.log('[ShaderWorker] Stopped rendering loop')
}

// Notify main thread that worker is ready
self.postMessage({ type: 'ready' })
