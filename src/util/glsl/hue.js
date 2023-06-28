export default /*glsl*/ `

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
