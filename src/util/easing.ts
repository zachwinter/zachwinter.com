import { bezier } from './bezier'
import { clamp } from './numbers'

export const DEFAULT_EASING = [0.66, 0.05, 0.05, 0.98] as const
export const EASE_IN_OUT = [0, 0.0, 0.2, 1] as const

const appliedDefault = bezier(
  DEFAULT_EASING[0],
  DEFAULT_EASING[1],
  DEFAULT_EASING[2],
  DEFAULT_EASING[3]
)
const appliedEaseInOut = bezier(EASE_IN_OUT[0], EASE_IN_OUT[1], EASE_IN_OUT[2], EASE_IN_OUT[3])

export function easeInOut(progress: number) {
  return appliedEaseInOut(clamp(progress))
}

export function ease(progress: number) {
  return appliedDefault(clamp(progress))
}
