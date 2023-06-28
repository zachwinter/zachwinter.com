export default /*glsl*/ `

vec3 k_rainbow(float progress, float stretch, float offset) {
  return vec3(cos(vec3(-2, 0, -1) * 3.14159265359 * 2. / 3. + (2. * 3.14159265359) * (progress * stretch) + offset) * 0.5 + 0.5);
}

`
