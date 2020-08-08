
import { buildMutations } from '@/store/util'
import cloneDeep from 'lodash/cloneDeep'
import interpolateNumber from 'd3-interpolate/src/number' 
import { timer } from '@/util/timing'
import home from './backgrounds/home'
import work from './backgrounds/work'
import contact from './backgrounds/contact'
import resume from './backgrounds/resume'

export const SET_UNIFORMS = 'SET_UNIFORMS'
export const SET_SHADER = 'SET_SHADER'
export const SET_Y_OFFSET = 'SET_Y_OFFSET'
export const SET_TWEENING_OFFSET = 'SET_TWEENING_OFFSET'

export const MUTATIONS = {
  [SET_UNIFORMS]: 'uniforms',
  [SET_SHADER]: 'shader',
  [SET_Y_OFFSET]: 'yOffset',
  [SET_TWEENING_OFFSET]: 'tweeningOffset'
}

const shader = `
#define BALLS 4
#define PI 3.14159265358979323846264338327950

mat2 rotate2d(float _angle){
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main () {
  vec2 uv = -1. + 2.* vUv.xy;
  uv.x *= resolution.x/resolution.y;
  gl_FragColor = vec4(0);
  uv = normalize(uv) * length(uv);
  uv.y += yOffset;
  vec2 uv2 = uv * zoom/5.;
  vec2 uv3 = uv * zoom/15.;
  uv = mix(uv2, uv3, abs(.1*sin(time/4000.)));
  float dist = distance(uv, vec2(0));
  float thing = dist * .001*sin(shapeMultiplier*dot(uv2, uv3)/dist - time/660.);
  uv *= rotate2d(rotation * (dist - time/2000.));
  float _grid = (cos(uv.x * xMultiplier - time/400.) - sin(uv.y * yMultiplier + time/300.));
  uv /= colorSpread * thing  * _grid;
  uv *= dist;
  for (int i = 0; i < BALLS; i++) {
    float t = float(i) * PI / float(BALLS);
    vec2 p = vec2(sin(t), cos(t));
    p += cos(time/6000. + float(i) * PI);
    vec3 col = cos(vec3(0, 1, -1) * PI * 2. / 3. + PI * (time / 4400. + float(i) / 5.)) * 0.5 + 0.5;
    gl_FragColor += vec4(ballSize  / length(uv + p * colorMultiplier) * col, 1.0);
  }
  gl_FragColor.xyz = glow * brightness * pow(gl_FragColor.xyz, vec3(contrast));
  gl_FragColor.w = 1.0;
  gl_FragColor = 1. - gl_FragColor;
}
`

export default {
  namespaced: true,
  state: {
    uniforms: home,
    shader,
    yOffset: 0,
    tweeningOffset: false
  },
  mutations: buildMutations(MUTATIONS),
  actions: {
    async tween ({ state, commit }, name) {
      const keys = Object.keys(state.uniforms)
      const from = cloneDeep(state.uniforms)
      let to = null
      if (name === 'Work') to = {...work}
      if (name === 'Home') to = {...home}
      if (name === 'Contact') to = {...contact}
      if (name === 'Resume') to = {...resume}
      if (to === null) return
      const interpolators = keys.reduce((acc, key) => {
        acc[key] = interpolateNumber(from[key].value, to[key].value)
        return acc
      }, {})
      const yOffsetInterpolator = interpolateNumber(state.yOffset, 0)
      timer(1500, ({ progress }) => {
        const uniforms = keys.reduce((acc, key) => {
          acc[key] = { ...from[key], value: interpolators[key](progress) }
          return acc
        }, {})
        commit(SET_UNIFORMS, uniforms)
        commit(SET_Y_OFFSET, yOffsetInterpolator(progress))
      }, 'easeInOutCubic')
    },
    async scrollUp ({ commit, state }) {
      if (state.tweeningOffset) return
      commit(SET_TWEENING_OFFSET, true)
      const interpolator = interpolateNumber(state.yOffset, state.yOffset + 1)
      await timer(500, ({ progress }) => {
        const val = interpolator(progress)
        commit(SET_Y_OFFSET, val)
      }, 'easeInOutCubic')
      commit(SET_TWEENING_OFFSET, false)
    },
    async scrollDown ({ commit, state }) {
      if (state.tweeningOffset) return
      commit(SET_TWEENING_OFFSET, true)
      const interpolator = interpolateNumber(state.yOffset, state.yOffset - 1)
      await timer(500, ({ progress }) => {
        const val = interpolator(progress)
        commit(SET_Y_OFFSET, val)
      }, 'easeInOutCubic')
      commit(SET_TWEENING_OFFSET, false)
    }
  }
}