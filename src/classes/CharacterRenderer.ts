/**
 * CharacterRenderer - Core primitive for rendering monospace text to canvas
 *
 * Handles:
 * - Character sprite caching with DPR awareness
 * - Efficient character rendering via drawImage
 * - Measuring character dimensions
 *
 * Used by both CanvasText (animated text) and CanvasTerminal (grid viewport)
 */

export interface CharRenderOptions {
  opacity?: number
  scale?: number
  translateX?: number
  translateY?: number
}

export class CharacterRenderer {
  private charCache: Map<string, HTMLCanvasElement> = new Map()
  private dpr: number
  private _charWidth: number = 0
  private _charHeight: number
  private fontSize: number
  private fontFamily: string
  private defaultColor: string

  constructor(options: {
    fontSize: number
    fontFamily?: string
    color?: string
    dpr?: number
  }) {
    this.fontSize = options.fontSize
    this.fontFamily = options.fontFamily || 'monospace'
    this.defaultColor = options.color || '#ffffff'
    this.dpr = options.dpr || window.devicePixelRatio
    this._charHeight = this.fontSize
  }

  get charWidth(): number {
    return this._charWidth
  }

  get charHeight(): number {
    return this._charHeight
  }

  /**
   * Measure character width using a temporary canvas context
   * Only needs to be called once for monospace fonts
   */
  measureCharWidth(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`
    const metrics = ctx.measureText('M')
    this._charWidth = metrics.width
  }

  /**
   * Get or create a cached character sprite
   */
  private getCachedChar(char: string, color: string): HTMLCanvasElement {
    const cacheKey = `${char}-${color}`

    if (this.charCache.has(cacheKey)) {
      return this.charCache.get(cacheKey)!
    }

    return this.createCharSprite(char, color)
  }

  /**
   * Create a new character sprite with DPR scaling
   */
  private createCharSprite(char: string, color: string): HTMLCanvasElement {
    const cacheKey = `${char}-${color}`
    const charCanvas = document.createElement('canvas')
    const charCtx = charCanvas.getContext('2d')!

    // Size canvas with DPR for crisp rendering
    charCanvas.width = this._charWidth * this.dpr
    charCanvas.height = this._charHeight * this.dpr

    // Scale context so we can draw in logical pixels
    charCtx.scale(this.dpr, this.dpr)

    charCtx.font = `${this.fontSize}px ${this.fontFamily}`
    charCtx.fillStyle = color
    charCtx.textBaseline = 'top'
    charCtx.fillText(char, 0, 0)

    this.charCache.set(cacheKey, charCanvas)
    return charCanvas
  }

  /**
   * Render a character at the specified position with optional transforms
   */
  renderChar(
    ctx: CanvasRenderingContext2D,
    char: string,
    x: number,
    y: number,
    color?: string,
    options?: CharRenderOptions
  ): void {
    const charColor = color || this.defaultColor
    const sprite = this.getCachedChar(char, charColor)

    if (options) {
      // Render with transforms
      ctx.save()

      if (options.opacity !== undefined) {
        ctx.globalAlpha = options.opacity
      }

      // Translate to position
      ctx.translate(x, y)

      // Transform origin: bottom-left of character
      ctx.translate(0, this._charHeight)

      if (options.scale !== undefined) {
        ctx.scale(options.scale, options.scale)
      }

      if (options.translateX || options.translateY) {
        ctx.translate(
          options.translateX || 0,
          (options.translateY || 0) - this._charHeight
        )
      } else {
        ctx.translate(0, -this._charHeight)
      }

      ctx.drawImage(sprite, 0, 0, this._charWidth, this._charHeight)
      ctx.restore()
    } else {
      // Fast path: no transforms
      ctx.drawImage(sprite, x, y, this._charWidth, this._charHeight)
    }
  }

  /**
   * Clear the character cache
   * Call when font or color settings change
   */
  clearCache(): void {
    this.charCache.clear()
  }

  /**
   * Update renderer settings and clear cache
   */
  updateSettings(settings: {
    fontSize?: number
    fontFamily?: string
    color?: string
  }): void {
    if (settings.fontSize !== undefined) {
      this.fontSize = settings.fontSize
      this._charHeight = this.fontSize
    }
    if (settings.fontFamily !== undefined) {
      this.fontFamily = settings.fontFamily
    }
    if (settings.color !== undefined) {
      this.defaultColor = settings.color
    }

    this.clearCache()
  }
}
