export interface RAF {
  ctx?: CanvasRenderingContext2D
  dpr: number
  now: DOMHighResTimeStamp
  elapsed: DOMHighResTimeStamp
  width: number
  height: number
}

export class Coords2D extends Array {
  get x(): number {
    return this[0]
  }

  get y(): number {
    return this[1]
  }
}
