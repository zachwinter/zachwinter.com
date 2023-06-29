export function matchMedia (query:string):boolean {
  return window.matchMedia?.(query)?.matches || false
}

export function watchMatchMedia(query:string, callback:Function = () => {}) {
  window.matchMedia?.(query)?.addEventListener('change', e => callback(e.matches))
}