<template lang="pug">
.renderer(ref="container")
</template>

<script>
import { Uniform } from 'three/src/core/Uniform'
import { Vector2 } from 'three/src/math/Vector2'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { Mesh } from 'three/src/objects/Mesh'
import { DoubleSide } from 'three/src/constants'
import { bind } from '@/store/util'

export default {
  props: {
    shader: {
      type: String,
      required: true
    },

    uniforms: {
      type: Object,
      required: true
    },

    yOffset: {
      type: Number,
      required: true
    },

    hidpi: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    async uniforms (val, old) {
      if (old && JSON.stringify(val) === JSON.stringify(old)) return
      await this.$nextTick()
      if (old) {
        const newKeys = Object.keys(val)
        const oldKeys = Object.keys(old)
        const keysAreEqual = JSON.stringify(newKeys) === JSON.stringify(oldKeys)
        if (keysAreEqual) return this.applyUniforms({ updateShader: false })
      }
      this.applyUniforms({ updateShader: true })
    },
    async shader (val, old) {
      if (old && JSON.stringify(val) === JSON.stringify(old)) return
      await this.$nextTick()
      this.applyUniforms({ updateShader: true })
    }
  },

  computed: bind(['ui/mobile']),

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.scene = new Scene()
      this.renderer = new WebGLRenderer()
      this.renderer.setClearColor( '#000000', 1 )
      this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(this.getPixelRatio())
      window.renderer = this.renderer
      this.geometry = new PlaneGeometry(2, 2)
      this._uniforms = {
        resolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
        time: new Uniform(0),
        yOffset: new Uniform(this.yOffset),
        ...this.uniforms
      }
      this.material = new ShaderMaterial({
        uniforms: this._uniforms,
        side: DoubleSide,
        vertexShader: `
          ${this.printUniforms()}
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader:`
          ${this.printUniforms()}
          ${this.shader}
        `
      })
      this.mesh = new Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
      this.$refs.container.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onResize.bind(this))
      this.onResize()
    },

    printUniforms () {
      return Object.keys(this._uniforms).reduce((acc, key) => {
        let { value } = this._uniforms[key]
        const isVec2 = value instanceof Vector2
        let type = isVec2 ? Vector2 : typeof value
        if (type === 'string') {
          value = parseFloat(value)
          type = 'number'
        }
        switch (type) {
          case 'number':
            acc += `uniform float ${key};\n`
            break
          case 'boolean':
            acc += `uniform bool ${key};\n`
            break
          case Vector2:
            acc += `uniform vec2 ${key};\n`
            break
        }
        return acc
      }, `varying vec2 vUv;`)
    },

    applyUniforms ({ updateShader = false } = {}) {
      for (let key in this.uniforms) {
        this._uniforms[key] = this.uniforms[key]
      }

      if (updateShader) this.updateShader()
    },

    updateShader (val = this.shader) {
      if (!this.material) return
      this.material.fragmentShader = `
        ${this.printUniforms()}
        ${val}
      `
      this.material.needsUpdate = true
    },

    onResize () {
      if (this._uniforms) this._uniforms.resolution = new Uniform(new Vector2(window.innerWidth, window.innerHeight))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(this.getPixelRatio())
    },

    tick (now) {
      this._uniforms.yOffset.value = this.yOffset / 1.5
      this._uniforms.time.value = now / 8
      this.renderer.render(this.scene, this.camera)
    },

    getPixelRatio () {
      return this.hidpi ? Math.min(window.devicePixelRatio, 1.5) : 1
    }
  }
}
</script>

<style lang="scss">
.renderer {
  @include position(fixed, 0 null null 0);
  @include size(100vw, 100vh);
  z-index: -1;
}
</style>