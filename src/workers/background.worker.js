// import { Uniform } from 'three/src/core/Uniform'
// import { Vector2 } from 'three/src/math/Vector2'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
// import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
// import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
// import { Mesh } from 'three/src/objects/Mesh'
// import { DoubleSide } from 'three/src/constants'

const STATE = {}

self.onmessage = ({ data }) => {
  console.log(data)
  const { type, payload } = data
  switch (type){
    case 'INIT':
      const { canvas, width, height, dpi, uniforms } = payload
      STATE.canvas = canvas
      STATE.width = width
      STATE.height = height
      STATE.dpi = dpi
      STATE.uniforms = uniforms
      init()
      return
    case 'RENDER':
      render()
      return
    default:
      return
  }
}

function init () {
  console.log('init')
  STATE.scene = new Scene()
  STATE.renderer = new WebGLRenderer({ canvas: STATE.canvas })
  STATE.renderer.setClearColor( '#000000', 1 )
  STATE.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
  STATE.renderer.setSize(STATE.width, STATE.height)
  STATE.renderer.setPixelRatio(STATE.dpi)
}

function render () {
  console.log('render')
}