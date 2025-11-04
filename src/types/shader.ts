import Uniform from '../classes/Uniform'
import { type UniformTuple } from './uniforms'
import { type Artboard } from './artboard'

export type ShaderConfig = {
  parent?: HTMLElement | string
  dpr?: number
  onResize?: ({ width, height, dpr }: Artboard) => unknown
  debug?: boolean
  vertexShader?: string
  fragmentShader?: string
  uniforms?: UniformTuple[]
  animate?: boolean
  shader?: string
  shaderpad?: boolean
}

export interface ShaderState extends Artboard {
  uniforms: Record<string, Uniform>
  volume: number
  internalUniforms: UniformTuple[]
  stream: number
  animate: boolean
}
