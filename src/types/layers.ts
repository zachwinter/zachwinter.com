export const BLEND_MODES = [
  'average',
  'color-burn',
  'color-dodge',
  'darken',
  'difference',
  'exclusion',
  'glow',
  'hard-light',
  'hard-mix',
  'lighten',
  'linear-burn',
  'linear-dodge',
  'linear-light',
  'multiply',
  'negation',
  'normal',
  'overlay',
  'phoenix',
  'pin-light',
  'reflect',
  'screen',
  'soft-light',
  'subtract',
  'vivid-light'
] as const

export type BlendMode = (typeof BLEND_MODES)[number]

export type Layer = {
  shader: string
  mode?: '' | '*' | '/' | '+' | '-'
  blending?: BlendMode
}
