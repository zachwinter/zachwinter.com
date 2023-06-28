export function createElement(
  type: string,
  target: HTMLElement | null = null
): HTMLElement {
  const element = document.createElement(type);
  if (target) {
    target.appendChild(element);
  }
  return element;
}

export function styleElement(
  el: HTMLElement,
  styles: Record<keyof CSSStyleDeclaration, string>
): void {
  for (let key in styles) {
    el.style[key] = styles[key];
  }
}

export function createStylesheet(styles: string): void {
  const style = document.createElement('style');
  style.innerText = styles;
  document.head.appendChild(style);
}

export function once(element: HTMLElement | Window, event: any) {
  return new Promise((resolve: Function) => {
    const handler = () => {
      element.removeEventListener(event, handler)
      resolve()
    }

    element.addEventListener(event, handler)
  })
}

export function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = () => resolve(true)
    script.onerror = () => reject()
    script.src = src
    document.body.appendChild(script)
  })
}
