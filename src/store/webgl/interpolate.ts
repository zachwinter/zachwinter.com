import { interpolateNumber } from 'd3-interpolate'

export function buildInterpolators(from: any, to: any) {
  const iN = interpolateNumber

  return from.map((u: any, i: number) => {
    switch (u[1]) {
      case 0:
        const iVal = iN(u[2][0], to[i][2][0])
        const iMin = iN(u[2][1], to[i][2][1])
        const iMax = iN(u[2][2], to[i][2][2])
        const iStep = iN(u[2][3], to[i][2][3])
        return (t: number) => [iVal(t), iMin(t), iMax(t), iStep(t)]
      case 1:
        return () => to[i][2]
      case 3:
        const iR = iN(u[2][0], to[i][2][0])
        const iG = iN(u[2][1], to[i][2][1])
        const iB = iN(u[2][2], to[i][2][2])
        return (t: number) => [iR(t), iG(t), iB(t)]
    }
  })
}
