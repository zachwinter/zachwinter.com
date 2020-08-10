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
    darkMode: {
      type: Boolean,
      default: false
    },
    hidpi: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dpi () {
      return this.hidpi ? window.devicePixelRatio : 1
    }
  },
  mounted () {
    this.scene = new Scene()
    this.renderer = new WebGLRenderer()
    this.renderer.setClearColor( '#000000', 1 )
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(this.dpi)
    window.renderer = this.renderer
    this.geometry = new PlaneGeometry(2, 2)
    this._uniforms = {
      resolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
      time: new Uniform(0),
      yOffset: new Uniform(this.yOffset),
      darkMode: new Uniform(this.darkMode),
      ...Object.keys(this.uniforms).reduce((acc, key) => {
        acc[key] = { value: this.uniforms[key] }
        return acc
      }, {})
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
  methods: {
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

    onResize () {
      if (this._uniforms) this._uniforms.resolution = new Uniform(new Vector2(window.innerWidth, window.innerHeight))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },

    tick (now) {
      for (let key in this.uniforms) this._uniforms[key].value = this.uniforms[key]
      this._uniforms.yOffset.value = this.yOffset / 1.5
      this._uniforms.darkMode.value = this.darkMode
      this._uniforms.time.value = now / 20
      this.renderer.render(this.scene, this.camera)
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