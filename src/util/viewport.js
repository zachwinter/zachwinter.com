export const MOBILE_BREAKPOINT = 767

export function minWidth (width) {
  return window.matchMedia(`(min-width: ${width}px)`).matches
}

export function maxWidth (width) {
  return window.matchMedia(`(max-width: ${width}px)`).matches
}

export function detectMobile () {
  return maxWidth(MOBILE_BREAKPOINT)
}

export function detectMobileLandscape () {
  return window.matchMedia(`(min-width: 320px) and (max-width: 900px) and (orientation: landscape)`).matches
}