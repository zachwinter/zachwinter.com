import { color } from './colors'

export function interpolateNumber (a, b, round = false) {
  return a = +a, b -= a, function(t) {
    if (round === true) {
      return ~~(a + b * t)
    } else {
      return a + b * t
    }
  }
}

export function interpolateColor (a, b, round = false) {
  const from = color(a)
  const to = color(b)

  return function (t) {
    const R = interpolateNumber(from.r, to.r, round)(t)
    const G = interpolateNumber(from.g, to.g, round)(t)
    const B = interpolateNumber(from.b, to.b, round)(t)
    const A = interpolateNumber(from.a, to.a)(t)
    return `rgba(${R},${G},${B},${A})`
  }	
}

export function interpolateColorArray (a, b, round = false) {
  return function (t) {
    const R = interpolateNumber(a[0], b[0], round)(t)
    const G = interpolateNumber(a[1], b[1], round)(t)
    const B = interpolateNumber(a[2], b[2], round)(t)
    return [R, G, B]
  }	
}

export function isColorArray (a) {
  return (Array.isArray(a) === true && a.length === 3)
}

export default function interpolate (a, b, round = true) {
  if (typeof a !== typeof b) {
    throw new Error('What are you trying to do?')
  }

  if (isColorArray(a)) return interpolateColorArray(a, b, round)
  return interpolateNumber(a, b, round)
}