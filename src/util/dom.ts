import { type ShaderConfig } from '../types/shader'

export function createElement(type: string, target: HTMLElement | null = null): HTMLElement {
  const element = document.createElement(type)
  if (target) {
    target.appendChild(element)
  }
  return element
}

export function styleElement(
  el: HTMLElement,
  styles: Record<keyof CSSStyleDeclaration, string>
): void {
  for (let key in styles) {
    el.style[key] = styles[key]
  }
}

export function createStylesheet(styles: string): void {
  const style = document.createElement('style')
  style.innerText = styles
  document.head.appendChild(style)
}

export function once(element: HTMLElement | Window, event: any) {
  return new Promise((resolve: Function) => {
    const handler = () => {
      element.removeEventListener(event, handler)
      resolve()
    }

    element.addEventListener(event, handler)
  })
}

export function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = () => resolve(true)
    script.onerror = () => reject()
    script.src = src
    document.body.appendChild(script)
  })
}

export function createCanvas({
  parent,
  dpr
}: {
  parent: HTMLElement
  dpr: number
}): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const { width, height } = parent.getBoundingClientRect()
  sizeCanvas(canvas, { width, height, dpr })
  parent.appendChild(canvas)
  return canvas
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  { width, height, dpr }: { width: number; height: number; dpr: number }
) {
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
}

export function createResizeObserver(
  element: HTMLElement,
  callback: ({ width, height }: { width: number; height: number }) => unknown
) {
  let rafId: number | null = null
  let lastWidth = 0
  let lastHeight = 0

  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect

    // Ignore if size hasn't actually changed (prevents feedback loops)
    if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1) {
      return
    }

    lastWidth = width
    lastHeight = height

    // Debounce with RAF to batch multiple resize events
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(() => {
      callback({ width, height })
      rafId = null
    })
  })

  observer.observe(element)

  return observer
}

export function getParentFromConfig(config: ShaderConfig): HTMLElement {
  return typeof config.parent === 'string'
    ? (document.querySelector(config.parent) as HTMLElement)
    : config.parent || (document.body as HTMLElement)
}
