export const MOBILE_BREAKPOINT = 640

export function minWidth (width) {
  return window.matchMedia(`(min-width: ${width}px)`).matches
}

export function maxWidth (width) {
  return window.matchMedia(`(max-width: ${width}px)`).matches
}

export function minHeight (height) {
  return window.matchMedia(`(min-height: ${height}px)`).matches
}

export function maxHeight (height) {
  return window.matchMedia(`(max-height: ${height}px)`).matches
}

export function orientation (orientation) {
  return window.matchMedia(`(orientation: ${orientation})`).matches
}

export function detectMobile () {
  return maxWidth(MOBILE_BREAKPOINT) && orientation('portrait') || detectMobileLandscape()
}

export function detectMobileLandscape () {
  return minWidth(320) && maxWidth(900) && orientation('landscape')
}