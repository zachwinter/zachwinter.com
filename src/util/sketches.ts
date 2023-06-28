function replaceLastInstanceOfSubString(str: string, substring: string, replacement: string) {
  const charpos = str.lastIndexOf(substring)
  if (charpos < 0) return str
  const one = str.substring(0, charpos)
  const two = str.substring(charpos + substring.length)
  return one + two + replacement
}

function parseShaders(sketches: any) {
  let parsed: any = sketches.reduce((acc, { shader, uniforms }: any, i: any) => {
    let formatted = window?.GLSLX?.format(shader)
      .replace('void main() {', `vec4 shader_${i} () {\n  vec4 GL_FRAG_COLOR = vec4(0., 0., 0., 1.);`)
      .replaceAll('gl_FragColor', 'GL_FRAG_COLOR')

    uniforms.forEach((uniform: any) => {
      formatted = formatted.replaceAll(uniform[0], `sketch_${i}_${uniform[0]}`)
    })

    acc += replaceLastInstanceOfSubString(formatted, '}', `  return GL_FRAG_COLOR;\n}\n`)
    return acc
  }, '')

  const defines = parsed.match(/(#define [a-zA-Z]*.[a-zA-Z0-9]*.)/g)
  defines?.forEach((define: any) => {
    parsed = parsed.replaceAll(define, '')
  })

  parsed += /* glsl */ `

void main () {
  vec4 color = mix(shader_0(), shader_1(), shader_tween);
  gl_FragColor = color;
}

`

  return [...new Set(defines)].join('\n') + '\n' + parsed
}

function parseUniforms(sketches: any) {
  return sketches.reduce(
    (acc: any, { uniforms }: any, i: any) => {
      const parsed = uniforms.map((uniform: any) => {
        uniform.splice(0, 1, `sketch_${i}_${uniform[0]}`)
        return uniform
      })
      acc.push(...parsed)
      return acc
    },
    [['shader_tween', 0, [0], [[0, 1, 0.001]]]]
  )
}

export function chainSketches(sketch1: any, sketch2: any) {
  const sketches = [sketch1, sketch2]
  const shader = parseShaders(sketches)
  const uniforms = parseUniforms(sketches)

  return {
    shader,
    uniforms
  }
}
