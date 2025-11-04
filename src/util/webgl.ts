import { Plane, Uniform } from '../classes'
import { type Uniform as UniformValue } from '../types/uniforms'
import { clone } from './clone'

export function createWebGL2Context(
  canvas: HTMLCanvasElement,
  config?: {
    alpha?: boolean
    antialias?: boolean
    powerPreference?: 'default' | 'high-performance'
    preserveDrawingBuffer?: boolean
    depth?: boolean
  }
): WebGL2RenderingContext {
  return canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    depth: false,
    ...(config || {})
  }) as WebGL2RenderingContext
}

export function compileShader({
  ctx,
  type,
  source,
  program
}: {
  ctx: WebGL2RenderingContext
  type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER'
  source: string
  program: WebGLProgram
}) {
  const shader = ctx.createShader(ctx[type]) as WebGLShader
  ctx.shaderSource(shader, source)
  ctx.compileShader(shader)

  // Check for compilation errors
  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    const info = ctx.getShaderInfoLog(shader)
    const shaderType = type === 'VERTEX_SHADER' ? 'vertex' : 'fragment'
    console.error(`[WebGL] ${shaderType} shader compilation failed:`, info)
    console.error(`[WebGL] Shader source:\n${source}`)
    ctx.deleteShader(shader)
    throw new Error(`${shaderType} shader compilation failed: ${info}`)
  }

  ctx.attachShader(program, shader)
  return shader
}

export function buildUniforms({
  ctx,
  program,
  uniforms
}: {
  ctx: WebGL2RenderingContext
  program: WebGLProgram
  uniforms: UniformValue[]
}) {
  return uniforms.reduce((acc: Record<string, Uniform>, uniform: UniformValue) => {
    acc[uniform[0]] = new Uniform(ctx, program, uniform)
    return acc
  }, {})
}

export function createWebGL2Program({
  ctx,
  vertexShader,
  fragmentShader,
  uniforms,
  width,
  height
}: {
  ctx: WebGL2RenderingContext
  vertexShader: string
  fragmentShader: string
  uniforms: UniformValue[]
  width: number
  height: number
}) {
  const program = ctx.createProgram() as WebGLProgram

  const vertex = compileShader({
    ctx,
    type: 'VERTEX_SHADER',
    source: vertexShader,
    program
  })

  const fragment = compileShader({
    ctx,
    type: 'FRAGMENT_SHADER',
    source: fragmentShader,
    program
  })

  ctx.linkProgram(program)

  // Check for linking errors
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    const info = ctx.getProgramInfoLog(program)
    console.error('[WebGL] Program linking failed:', info)
    console.error('[WebGL] Vertex shader:\n', vertexShader)
    console.error('[WebGL] Fragment shader:\n', fragmentShader)
    ctx.deleteProgram(program)
    throw new Error(`Program linking failed: ${info}`)
  }

  ctx.useProgram(program)
  ctx.viewport(0, 0, width, height)

  // Clear to magenta so we can see if WebGL is working at all
  ctx.clearColor(1.0, 0.0, 1.0, 1.0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)
  console.log('[WebGL] Program initialized, cleared to magenta')

  const uniformReferences = buildUniforms({ ctx, uniforms, program })
  const plane = new Plane(ctx)
  ctx.enableVertexAttribArray(0)
  ctx.vertexAttribPointer(ctx.getAttribLocation(program, 'position'), 2, ctx.FLOAT, false, 0, 0)

  return {
    plane,
    program,
    uniforms: uniformReferences,
    cleanup() {
      ctx.deleteShader(vertex)
      ctx.deleteShader(fragment)
      ctx.deleteProgram(program)
    }
  }
}

export function selectVariant(uniforms: UniformValue[], i: number) {
  return clone(uniforms).map((u: UniformValue) => {
    u[2] = u[1] === 0 ? (u as any)[2][i][0] : (u as any)[2][i]
    return u
  })
}
