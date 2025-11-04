import { type UniformTuple } from '../types/uniforms'
import { k_hue, k_kale, k_orb, k_rainbow, k_rotate2d, k_swap, k_uv } from './glsl-util'

export const DEFAULT_VERTEX_SHADER = /*glsl*/ `attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0, 1);
}`

export const DEFAULT_FRAGMENT_SHADER = /*glsl*/ `void main () {
  vec2 uv = k_uv(gl_FragCoord) * zoom;

  float r = sin(uv.x - stream);
  float g = cos(uv.y);
  float b = sin(uv.y);

  gl_FragColor = vec4(r, g, b, 1.);
}`

export const DEFUALT_UNIFORMS: UniformTuple[] = [['zoom', 0, 1]]

export const INTERNAL_UNIFORMS: UniformTuple[] = [
  ['resolution', 2, [window.innerWidth, window.innerHeight]],
  ['time', 0, 0],
  ['stream', 0, 0],
  ['volume', 0, 1]
] as const

export const SHADER_TYPE_MAP = {
  0: 'float',
  1: 'bool',
  2: 'vec2',
  3: 'vec3',
  4: 'vec4'
} as const

export const WEBGL_TYPE_MAP = {
  0: '1f',
  1: '1f',
  2: '2fv',
  3: '3fv',
  4: '4fv'
} as const

export const DEFAULT_DEFS = [
  'precision mediump float;',
  '',
  '#define PI 3.14159265359',
  '#define TWO_PI 2. * PI'
].join('\n')

export const RAW_UTILS = {
  k_hue,
  k_kale,
  k_orb,
  k_rainbow,
  k_rotate2d,
  k_swap,
  k_uv
} as any

export const RAW_UTIL_KEYS = Object.keys(RAW_UTILS) as any

export const SHADER_UTILS = Object.keys(RAW_UTILS).reduce((acc: string, key: string) => {
  acc += `${RAW_UTILS[key]}\n`
  return acc
}, '') as string
