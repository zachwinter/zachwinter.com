export function match (query) {
  return window.matchMedia(query).matches
}

export function minWidth (width) {
  return match(`(min-width: ${width}px)`)
}

export function maxWidth (width) {
  return match(`(max-width: ${width}px)`)
}

export function minHeight (height) {
  return match(`(min-height: ${height}px)`)
}

export function maxHeight (height) {
  return match(`(max-height: ${height}px)`)
}

export function orientation (orientation) {
  return match(`(orientation: ${orientation})`)
}

export function detectDarkMode () {
  return match('(prefers-color-scheme: dark)')
}

export function detectMobilePortrait () {
  return maxWidth(400) && orientation('portrait')
}

export function detectMobileLandscape () {
  return maxHeight(400) && orientation('landscape')
}

export function detectMobile () {
  return detectMobileLandscape() || detectMobilePortrait()
}