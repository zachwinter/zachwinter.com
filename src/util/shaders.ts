import { randomNumber } from './numbers'

export function generateShader(root = 2 + 4 * Math.random()) {
  const functions: any = ['sin', 'cos']
  const linearOperators: any = ['+', '-']
  const operators: any = ['+', '-', '*', '/']
  const multi: any = ['*', '/']
  const dimensions: any = ['x', 'y']
  const channels: any = ['r', 'g', 'b']
  const bool = () => Math.round(Math.random())
  const s = (array = []) => array[Math.floor(Math.random() * array.length)] || undefined
  const getChannelPair: any = a => ((a = s(channels)), [a, s(channels.filter(c => c !== a))])
  const getDimensionPair: any = a => ((a = s(dimensions)), [a, s(dimensions.filter(c => c !== a))])
  const getFunctionPair: any = a => ((a = s(functions)), [a, s(functions.filter(c => c !== a))])

  let shader = /*glsl*/ `void main () {\n`

  const uniforms = [
    ['speed', 0, [[1, 0, 2, 0.001]], true],
    ['zoom', 0, [[4, 1, 4 + root, 0.001]], false],
    ['mirror', 1, [false], true],
    ['kaleidoscope', 1, [false], true],
    ['warp', 1, [false], true]
  ]

  let uniform = 0
  const seed = (() => Math.random() * root)()
  let val = () => {
    const domain = () => [(seed / 2) * Math.random(), 2 * seed * Math.random()]
    let [min, max] = domain()
    const value = parseFloat(randomNumber(min, max).toFixed(3))
    uniforms.push([`VAR_${uniform}`, 0, [[value as any, min, max, 0.001]], false])
    uniform++
    return `VAR_${uniform - 1}`
  }
  const line = () => {
    let [x, y] = getDimensionPair()
    let a = bool() ? x : y
    let b = a === x ? y : x
    let [func1, func2] = getFunctionPair()
    const S = [func1, a, s(multi), val(), s(linearOperators), func2, b, s(multi), val(), s(linearOperators)]
    return `(${S[0]}(${val()} * uv.${S[1]} ${S[2]} ${S[3]} ${S[4]} stream)\n    ${s(linearOperators)} ${S[5]}(${val()} * uv.${S[6]} ${S[7]} ${S[8]} ${S[9]} stream))`
  }

  const r = `${line()} ${s(linearOperators)} ${line()}`
  const g = `${line()} ${s(operators)} ${line()}`
  const b = `${line()} ${s(operators)} ${line()}`
  const rotation = 5
  uniforms.push([`VAR_${uniform}`, 0, [[rotation as any, rotation - rotation / 2, rotation + rotation * 2, 0.001]], false])
  uniform++
  shader = /*glsl*/ `

void main () {
  vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;
  uv *= zoom;
  uv *= k_rotate2d(stream/-${Math.random() * 20 + 20});
  vec2 kale = k_kale(uv, vec2(-1), ${Math.ceil(4 + Math.random() * 12)}.);
  uv = k_swap(uv, abs(uv), mirror, mirrorTween, mirrorTweenProgress);
  uv = k_swap(uv, kale, kaleidoscope, kaleidoscopeTween, kaleidoscopeTweenProgress);
  uv = k_swap(uv, 20. * uv / dot(uv, uv), warp, warpTween, warpTweenProgress);
  uv *= k_rotate2d(stream/15. + length(uv)/(${`VAR_${uniform - 1}`} + 40.));`

  shader += /*glsl*/ `
  float r = ${r};
  float g = ${g};
  float b = ${b};\n`

  let [r1, r2] = getChannelPair()
  let [g1, g2] = getChannelPair()
  let [b1, b2] = getChannelPair()

  shader += /*glsl */ `  gl_FragColor = vec4(r ${s(linearOperators)} g ${s(linearOperators)}    ${val()}, b ${s(linearOperators)} g ${s(linearOperators)} ${val()}, b ${s(linearOperators)} g ${s(
    operators
  )} ${val()}, 1);

  gl_FragColor = k_hue(gl_FragColor, stream/1.);
  gl_FragColor.xyz = .5 + .5 * (1. - pow(abs(1.-log(abs(gl_FragColor.xyz))), vec3(${2 + Math.random() * 2})));
}`

  return { shader, uniforms }
}
