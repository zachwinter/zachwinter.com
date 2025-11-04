import { createCanvas } from '../util/canvas'

export interface SpriteOptions {
  width: number
  height: number
  paint: Function
}

export type Artboard = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  canvas: HTMLCanvasElement
}

export default class Sprite {
  public canvas: HTMLCanvasElement

  constructor({ width, height, paint }: SpriteOptions) {
    const { canvas, ctx } = createCanvas({ width, height })
    this.canvas = canvas
    paint({ ctx, width, height, canvas } as Artboard)
  }

  /**
   * Create a sprite from an ImageBitmap (from OffscreenCanvas worker)
   */
  static fromImageBitmap(bitmap: ImageBitmap, width: number, height: number): Sprite {
    // Create a regular canvas and draw the ImageBitmap onto it
    const { canvas, ctx } = createCanvas({ width, height })
    ctx.drawImage(bitmap, 0, 0)

    // Create sprite instance without going through constructor
    const sprite = Object.create(Sprite.prototype)
    sprite.canvas = canvas

    // Close the ImageBitmap to free resources
    bitmap.close()

    return sprite
  }

  applyTo(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.drawImage(this.canvas, x - width / 2, y - height / 2, width, height)
  }

  destroy() {
    this.canvas.remove()
  }
}
