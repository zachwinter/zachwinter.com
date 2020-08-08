export function once (el, event, handler = () => {}) {
  return new Promise(resolve => {
    const _handler = (e) => {
      handler(e)
      el.removeEventListener(event, _handler)
      resolve()
    }
  
    el.addEventListener(event, _handler)
  })
}