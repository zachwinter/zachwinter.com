export const k_hue = /*glsl*/ `
vec4 k_hue(vec4 color, float shift) {
  float I = dot(color, vec4(0.596, -0.275, -0.321, 0.0));
  float Q = dot(color, vec4(0.212, -0.523, 0.311, 0.0));
  float hue = atan(Q, I);
  float chroma = sqrt(I * I + Q * Q);
  hue += shift;
  Q = chroma * sin(hue);
  I = chroma * cos(hue);
  vec4 yIQ = vec4(dot(color, vec4(0.299, 0.587, 0.114, 0.0)), I, Q, 0.0);
  color.r = dot(yIQ, vec4(1.0, 0.956, 0.621, 0.0));
  color.g = dot(yIQ, vec4(1.0, -0.272, -0.647, 0.0));
  color.b = dot(yIQ, vec4(1.0, -1.107, 1.704, 0.0));
  return color;
}
`

export const k_kale = /*glsl*/ `
vec2 k_kale(vec2 uv, vec2 offset, float sides) {
  float angle = atan(uv.y, uv.x);
  angle = ((angle / 3.14159265359) + 1.0) * 0.5;
  angle = mod(angle, 1.0 / sides) * sides;
  angle = -abs(2.0 * angle - 1.0) + 1.0;
  angle = angle;
  float y = length(uv);
  angle = angle * (y);
  return vec2(angle, y) - offset;
}
`

export const k_orb = /*glsl*/ `
vec4 k_orb(vec2 uv, float size, vec2 position, vec3 color, float contrast) {
  return pow(vec4(size / length(uv + position) * color, 1.), vec4(contrast));
}
`

export const k_rainbow = /*glsl*/ `
vec3 k_rainbow(float progress, float stretch, float offset) {
  return vec3(cos(vec3(-2, 0, -1) * 3.14159265359 * 2. / 3. + (2. * 3.14159265359) * (progress * stretch) + offset) * 0.5 + 0.5);
}
`

export const k_rotate2d = /* glsl */ `
mat2 k_rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
`

export const k_swap = /* glsl */ `
vec2 k_swap(vec2 uv, vec2 uv2, bool val, bool valTween, float valTweenProgress) {
  return valTween
    ? (val ? mix(uv, uv2, valTweenProgress) : mix(uv2, uv, valTweenProgress))
    : (val ? uv2 : uv);
}
`

export const k_sphere = /*glsl */ `
vec2 k_sphere (vec3 pos) {
  // Convert to spherical coordinates
  float theta = atan(pos.z, pos.x);  // longitude
  float phi = acos(pos.y);           // latitude

  // Map to UV space [0,1]
  float u = (theta + PI) / (2.0 * PI);  // longitude: -π to π → 0 to 1
  float v = phi / PI;                    // latitude: 0 to π → 0 to 1

  return vec2(u, v);
}
`

export const k_uv_to_sphere = /* glsl */ `
vec3 k_uv_to_sphere(vec2 uv) {
  // Convert UV coordinates to spherical coordinates
  float theta = uv.x * TWO_PI;  // longitude: 0 to 1 → 0 to 2π
  float phi = uv.y * PI;        // latitude: 0 to 1 → 0 to π

  // Convert spherical to cartesian coordinates
  float x = sin(phi) * cos(theta);
  float y = cos(phi);
  float z = sin(phi) * sin(theta);

  return vec3(x, y, z);
}
`

export const k_uv = /* glsl */ `
vec2 k_uv() {
  vec2 uv = 2.0 * gl_FragCoord.xy - 1.0;
  uv.x *= resolution.x / resolution.y;
  return uv;
}
`
