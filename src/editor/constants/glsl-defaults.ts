import { k_hue, k_kale, k_orb, k_rainbow, k_rotate2d, k_swap, k_uv, k_sphere, k_uv_to_sphere } from "./glsl-util";

export const DEFAULT_VERTEX_SHADER = /*glsl*/ `void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const DEFAULT_BUFFER_SHADER = /*glsl*/ `void main () {
  gl_FragColor = vec4(0., 0., 1., 1.);
}`;

export const DEFAULT_FRAGMENT_SHADER = /*glsl*/ `void main () {
  gl_FragColor = vec4(.8, .2, .6, 1.);
}`;

export const RAW_UTILS = {
  k_hue,
  k_kale,
  k_orb,
  k_rainbow,
  k_rotate2d,
  k_swap,
  k_uv,
  k_sphere,
  k_uv_to_sphere,
} as any;

export const GLSL_UTILS = Object.keys(RAW_UTILS).reduce((acc: string, key: string) => {
  acc += `${RAW_UTILS[key]}`;
  return acc;
}, "\n");
