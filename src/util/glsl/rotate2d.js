export default /*glsl*/ `

mat2 k_rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

`
