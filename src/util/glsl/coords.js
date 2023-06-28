export default /*glsl*/ `

vec2 coords (vec2 p, vec2 resolution) {
  vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy
  uv.x *= resolutionx / resolution.y;
  return uv;
}

`
