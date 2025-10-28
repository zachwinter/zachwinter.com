export default `void main () {
  float volume = pow(volume, 1.75);
  float stream = stream / -10.;
  vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x/resolution.y;
  uv *= zoom;
  uv.y += scrollY;
  uv *= k_rotate2d(stream / 5.);
  vec4 streamOffsets = vec4(stream/1.6, stream/-2., stream/2., stream/.5);
  vec2 uv0 = uv;
  vec2 uv1 = uv0 * iterator;
  vec2 uv2 = uv1 * iterator;
  vec2 uv3 = uv2 * iterator;
  vec2 uv4 = uv3 * iterator;
  vec4 uvX = vec4(uv0.x, uv1.x, uv2.x, uv3.x) / div;
  vec4 uvY = vec4(uv0.y, uv1.y, uv2.y, uv3.y) / div;
  vec4 a = radius * cos(uvX + streamOffsets.x);
  vec4 b = radius * sin(uvY + streamOffsets.y);
  vec4 c = wave * sin(split * uvX - streamOffsets.z);
  vec4 d = wave * cos(split * uvY - streamOffsets.w);
  vec4 x = a * b - c + d;
  float a4 = radius * cos(uv4.x / div + streamOffsets.x);
  float b4 = radius * sin(uv4.y / div + streamOffsets.y);
  float c4 = wave * sin(split * uv4.x / div - streamOffsets.z);
  float d4 = wave * cos(split * uv4.y / div - streamOffsets.w);
  float x4 = a4 * b4 - c4 + d4;
  gl_FragColor =
    k_orb(uv0, volume * orbSize, vec2(x.x), k_rainbow(0./iterations, colorShift, colorOffset), contrast) +
    k_orb(uv1, volume * orbSize, vec2(x.y), k_rainbow(1./iterations, colorShift, colorOffset), contrast) +
    k_orb(uv2, volume * orbSize, vec2(x.z), k_rainbow(2./iterations, colorShift, colorOffset), contrast) +
    k_orb(uv3, volume * orbSize, vec2(x.w), k_rainbow(3./iterations, colorShift, colorOffset), contrast) +
    k_orb(uv4, volume * orbSize, vec2(x4),  k_rainbow(4./iterations, colorShift, colorOffset), contrast);
}`
