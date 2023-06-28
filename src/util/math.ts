const x1: number = 0
const y1: number = 0
const x2: number = 0
const y2: number = 0

export function distance2D(X1: number = x1, Y1: number = y1, X2: number = x2, Y2: number = y2): number {
  return Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2))
}
