import Plane from './Plane'
import { createCanvas, sizeCanvas, createResizeObserver, getParentFromConfig } from '../util/dom'
import { createWebGL2Context, createWebGL2Program } from '../util/webgl'
import { clone } from '../util/clone'
import { log } from '../util/log'
import {
  DEFAULT_VERTEX_SHADER,
  DEFAULT_FRAGMENT_SHADER,
  INTERNAL_UNIFORMS,
  SHADER_TYPE_MAP,
  DEFAULT_DEFS,
  DEFUALT_UNIFORMS,
  SHADER_UTILS
} from './../constants/glsl-defaults'
import { type UniformTuple, type ShaderConfig, type ShaderState } from '../types'

export default class Shader {
  public config: ShaderConfig
  private canvas: HTMLCanvasElement
  private observer: ResizeObserver
  private ctx: WebGL2RenderingContext
  public state: ShaderState
  private plane: Plane
  private cleanup: () => void

  constructor(config: ShaderConfig) {
    const parent = getParentFromConfig(config)
    const { canvas, observer, ctx } = this.initContext(parent)

    this.canvas = canvas
    this.observer = observer
    this.ctx = ctx

    this.config = {
      ...(config || {}),
      debug: config?.debug ?? true,
      vertexShader: config?.vertexShader || DEFAULT_VERTEX_SHADER,
      fragmentShader: config?.fragmentShader || DEFAULT_FRAGMENT_SHADER,
      uniforms: config?.uniforms || DEFUALT_UNIFORMS,
      animate: !!config?.animate,
      shaderpad: config?.shaderpad || false,
      parent: parent as HTMLElement
    }

    this.state = {
      uniforms: {},
      width: 0,
      height: 0,
      dpr: config?.dpr || window.devicePixelRatio,
      volume: 1,
      stream: 0,
      internalUniforms: clone(INTERNAL_UNIFORMS),
      animate: !!this.config.animate
    }

    const { plane, uniforms, cleanup } = this.initProgram()

    this.state.uniforms = uniforms
    this.plane = plane

    if (typeof config?.shader === 'string') {
      this.config.fragmentShader = config.shader as string
    }

    this.cleanup = cleanup
    this.tick = this.tick.bind(this)

    console.log('[Shader] Initialization complete')
    console.log('[Shader] Canvas size:', this.canvas.width, 'x', this.canvas.height)
    console.log('[Shader] State:', this.state)
    console.log('[Shader] Uniforms:', Object.keys(this.state.uniforms))
    console.log('[Shader] Config.animate:', this.config.animate)

    // Debug: Log the actual fragment shader being used
    if (this.config.debug) {
      console.log('[Shader] Fragment shader source:')
      console.log(this.fragmentShader)
    }

    requestAnimationFrame(this.tick)
    this.log('self', this)
  }

  get dpr() {
    return this.config?.dpr || window.devicePixelRatio
  }

  set dpr(value: number) {
    this.config.dpr = value
    this.size = { width: this.state.width, height: this.state.height }
  }

  set size({ width, height }: { width: number; height: number }) {
    if (!this.canvas) return

    this.state.width = width
    this.state.height = height

    const size = {
      width: this.state.width,
      height: this.state.height,
      dpr: this.dpr
    }

    sizeCanvas(this.canvas, size)
    this.state.internalUniforms[0][2] = [size.width * size.dpr, size.height * size.dpr]
    this.ctx.viewport(0, 0, size.width * size.dpr, size.height * size.dpr)
    this.config?.onResize?.(size)
    this.log('size', size)
  }

  get vertexShader() {
    const shader = this.config?.vertexShader || DEFAULT_VERTEX_SHADER

    this.log('vertex', shader)

    return shader
  }

  get fragmentShader() {
    const mainShader = this.config?.fragmentShader || DEFAULT_FRAGMENT_SHADER

    const shader = `
${DEFAULT_DEFS}

${this.uniformDeclarations}

${SHADER_UTILS}

${
  this.config?.shaderpad
    ? `void main () {
  vec2 uv = k_uv(gl_FragCoord);
${mainShader}
  gl_FragColor = vec4(color, 1.);
}`
    : mainShader
}
`

    this.log('fragment', shader)

    return shader
  }

  set stream(value: number) {
    this.state.stream = value
  }

  get uniforms() {
    return [...(this.state?.internalUniforms || []), ...(this.config?.uniforms || [])]
  }

  set uniform(uniform: UniformTuple) {
    this.config.uniforms?.forEach((u) => {
      if (u[0] === uniform[0]) u[2] = uniform[2]
    })
  }

  get uniformDeclarations() {
    return this.uniforms.reduce((acc, [name, type]) => {
      acc += `uniform ${SHADER_TYPE_MAP[type as 0 | 1 | 2 | 3 | 4]} ${name};\n`
      return acc
    }, '')
  }

  initContext(parent: HTMLElement) {
    const canvas = createCanvas({ parent, dpr: this.dpr })

    const observer = createResizeObserver(parent, (size) => {
      this.size = size
    })

    const ctx = createWebGL2Context(canvas)

    return { canvas, observer, ctx }
  }

  initProgram() {
    const { plane, uniforms, cleanup } = createWebGL2Program({
      ctx: this.ctx,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
      uniforms: this.uniforms,
      fragmentShader: this.fragmentShader,
      vertexShader: this.vertexShader
    })

    return { plane, uniforms, cleanup }
  }

  tick(now: DOMHighResTimeStamp = window.performance.now()) {
    if (!this.ctx) {
      console.warn('[Shader] No WebGL context in tick()')
      return
    }

    this.state.internalUniforms[1][2] = now / 1000
    this.state.internalUniforms[2][2] = this.state.stream || now / 1000
    this.state.internalUniforms[3][2] = this.state.volume

    this.uniforms?.forEach((uniform) => {
      if (!this.state?.uniforms?.[uniform[0]]) {
        console.warn(`[Shader] Missing uniform: ${uniform[0]}`)
        return
      }
      this.state.uniforms[uniform[0]].set(uniform[2])
    })

    this.plane.render()

    if (this.config.animate) {
      requestAnimationFrame(this.tick)
    }
  }

  log(label: string, data: unknown) {
    if (this.config.debug) log('shader', label, data)
  }

  rebuild({ fragmentShader, uniforms }: { fragmentShader?: string; uniforms?: UniformTuple[] }) {
    this.cleanup()

    this.config.fragmentShader = fragmentShader || this.config.fragmentShader || DEFAULT_FRAGMENT_SHADER
    this.config.uniforms = uniforms || this.config.uniforms || []

    const { plane, uniforms: uniformState, cleanup } = this.initProgram()

    this.plane = plane
    this.state.uniforms = uniformState
    this.cleanup = cleanup
  }

  destroy() {
    this.cleanup()
    this.observer.disconnect()
    this.canvas.remove()
    this.log('destroy', null)
  }
}
