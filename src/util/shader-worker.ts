/**
 * Shader Worker Manager
 *
 * Progressive enhancement: Uses OffscreenCanvas worker when available,
 * falls back to main thread rendering.
 */

import { supportsOffscreenCanvas } from './feature-detection'
import { Shader } from '@/fragment-shader'
import type { ShaderConfig } from '@/fragment-shader'

export interface ShaderWorkerConfig extends ShaderConfig {
  useWorker?: boolean
}

export class ShaderWorkerManager {
  private worker: Worker | null = null
  private shader: Shader | null = null
  private canvas: HTMLCanvasElement | null = null
  private useWorker: boolean
  private config: ShaderWorkerConfig
  public stream: number = 0
  public volume: number = 1

  constructor(config: ShaderWorkerConfig) {
    this.config = config
    this.useWorker = config.useWorker !== false && supportsOffscreenCanvas()

    if (this.useWorker) {
      console.log('[ShaderWorker] Using worker-based rendering (OffscreenCanvas)')
      this.initWorker()
    } else {
      console.log('[ShaderWorker] Using main thread rendering (fallback)')
      this.initMainThread()
    }
  }

  private serializeUniforms(uniforms: any[]): any[] {
    // Clone uniforms and ensure all data is serializable (no functions, DOM nodes, etc)
    return uniforms.map(([name, type, value]) => {
      // Deep clone arrays to ensure no nested non-cloneable data
      let serializedValue: any

      if (Array.isArray(value)) {
        // Recursively serialize arrays
        serializedValue = value.map(v => {
          if (Array.isArray(v)) {
            return [...v]
          } else if (typeof v === 'object' && v !== null) {
            // Plain object - serialize to JSON and back to strip non-cloneable data
            try {
              return JSON.parse(JSON.stringify(v))
            } catch (e) {
              console.warn(`[ShaderWorker] Could not serialize value for uniform ${name}:`, v)
              return null
            }
          } else if (typeof v === 'function') {
            console.warn(`[ShaderWorker] Skipping function in uniform ${name}`)
            return null
          }
          return v
        })
      } else if (typeof value === 'object' && value !== null) {
        // Plain object - serialize
        try {
          serializedValue = JSON.parse(JSON.stringify(value))
        } catch (e) {
          console.warn(`[ShaderWorker] Could not serialize value for uniform ${name}:`, value)
          serializedValue = null
        }
      } else if (typeof value === 'function') {
        console.warn(`[ShaderWorker] Skipping function in uniform ${name}`)
        serializedValue = null
      } else {
        // Primitive value
        serializedValue = value
      }

      return [name, type, serializedValue]
    })
  }

  private initWorker() {
    // Create canvas
    this.canvas = document.createElement('canvas')
    const parent = this.config.parent || document.body
    parent.appendChild(this.canvas)

    // Size canvas
    const width = this.config.width || window.innerWidth
    const height = this.config.height || window.innerHeight
    const dpr = this.config.dpr || window.devicePixelRatio

    this.canvas.width = width * dpr
    this.canvas.height = height * dpr
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    if (this.config.fillViewport) {
      this.canvas.style.position = 'absolute'
      this.canvas.style.top = '0'
      this.canvas.style.left = '0'
      this.canvas.style.zIndex = '0'
    }

    // Create worker
    this.worker = new Worker(
      new URL('../workers/shader-renderer.worker.ts', import.meta.url),
      { type: 'module' }
    )

    // Transfer canvas to worker
    const offscreen = this.canvas.transferControlToOffscreen()

    // Serialize uniforms for worker transfer (remove non-cloneable data)
    const serializedUniforms = this.serializeUniforms(this.config.uniforms || [])

    console.log('[ShaderWorker] Serialized uniforms:', serializedUniforms)

    this.worker.addEventListener('message', (e) => {
      const message = e.data

      if (message.type === 'ready') {
        // Worker ready, send init message
        console.log('[ShaderWorker] Sending init message to worker')
        this.worker!.postMessage(
          {
            type: 'init',
            id: 'shader',
            canvas: offscreen,
            shader: this.config.shader,
            uniforms: serializedUniforms,
            width,
            height,
            dpr
          },
          [offscreen] // Transfer OffscreenCanvas
        )
      } else if (message.type === 'error') {
        console.error('[ShaderWorker] Error:', message.error)
        this.config.onError?.(message.error)
      }
    })

    this.worker.addEventListener('error', (error) => {
      console.error('[ShaderWorker] Worker error:', error)
      this.config.onError?.(error)
    })

    // Handle resize
    if (this.config.fillViewport || this.config.fillContainer) {
      window.addEventListener('resize', this.onWindowResize.bind(this))
    }
  }

  private initMainThread() {
    this.shader = new Shader(this.config)
  }

  private onWindowResize() {
    if (!this.canvas || !this.worker) return

    const width = this.config.fillContainer
      ? (this.config.parent as HTMLElement)?.offsetWidth || window.innerWidth
      : window.innerWidth
    const height = this.config.fillContainer
      ? (this.config.parent as HTMLElement)?.offsetHeight || window.innerHeight
      : window.innerHeight
    const dpr = this.config.dpr || window.devicePixelRatio

    this.canvas.width = width * dpr
    this.canvas.height = height * dpr
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.worker.postMessage({
      type: 'resize',
      id: 'shader',
      width,
      height,
      dpr
    })

    this.config.onResize?.()
  }

  setUniform(key: string, value: any) {
    if (this.useWorker && this.worker) {
      // Find uniform in config and update it
      const uniforms = this.config.uniforms || []
      const index = uniforms.findIndex(([name]) => name === key)
      if (index !== -1) {
        uniforms[index][2] = value
        const serializedUniforms = this.serializeUniforms(uniforms)
        this.worker.postMessage({
          type: 'update-uniforms',
          id: 'shader',
          uniforms: serializedUniforms
        })
      }
    } else if (this.shader) {
      this.shader.setUniform(key, value)
    }
  }

  setStreamVolume(stream: number, volume: number) {
    this.stream = stream
    this.volume = volume

    if (this.useWorker && this.worker) {
      this.worker.postMessage({
        type: 'update-stream-volume',
        id: 'shader',
        stream,
        volume
      })
    } else if (this.shader) {
      this.shader.stream = stream
      this.shader.volume = volume
    }
  }

  updateAllUniforms(uniforms: any[]) {
    // Update local config
    this.config.uniforms = uniforms

    if (this.useWorker && this.worker) {
      const serializedUniforms = this.serializeUniforms(uniforms)
      this.worker.postMessage({
        type: 'update-uniforms',
        id: 'shader',
        uniforms: serializedUniforms
      })
    } else if (this.shader) {
      // For main thread, update each uniform
      uniforms.forEach(([name, type, value]: any) => {
        this.shader!.setUniform(name, value)
      })
    }
  }

  set size(resolution: { width: number; height: number; dpr: number }) {
    if (this.useWorker && this.canvas && this.worker) {
      const { width, height, dpr } = resolution

      this.canvas.width = width * dpr
      this.canvas.height = height * dpr
      this.canvas.style.width = `${width}px`
      this.canvas.style.height = `${height}px`

      this.worker.postMessage({
        type: 'resize',
        id: 'shader',
        width,
        height,
        dpr
      })
    } else if (this.shader) {
      this.shader.size = resolution
    }
  }

  rebuild({ shader, uniforms }: { shader?: string; uniforms?: any[] }) {
    if (this.useWorker) {
      // For worker mode, we need to recreate everything
      // For now, just update the config and log a warning
      console.warn('[ShaderWorker] Rebuild not fully supported in worker mode yet')
      if (shader) this.config.shader = shader
      if (uniforms) this.config.uniforms = uniforms
    } else if (this.shader) {
      this.shader.rebuild({ shader, uniforms })
    }
  }

  start() {
    if (this.useWorker && this.worker) {
      this.worker.postMessage({ type: 'start', id: 'shader' })
    } else if (this.shader) {
      this.shader.start()
    }
  }

  stop() {
    if (this.useWorker && this.worker) {
      this.worker.postMessage({ type: 'stop', id: 'shader' })
    } else if (this.shader) {
      this.shader.stop()
    }
  }

  destroy() {
    if (this.useWorker) {
      this.worker?.terminate()
      this.worker = null
      this.canvas?.remove()
      this.canvas = null
      window.removeEventListener('resize', this.onWindowResize.bind(this))
    } else if (this.shader) {
      this.shader.destroy()
      this.shader = null
    }
  }
}
