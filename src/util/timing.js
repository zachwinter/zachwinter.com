import ease from './ease'

export function pause (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let _instances = []
let _running = false

export class Timer {
  constructor (duration, method, easing = 'linear', resolve) {
    this.duration = duration
    this.method = method
    this.easing = easing
    this.start = performance.now()
    this.complete = false
    this.resolve = resolve
  }

  tick () {
    if (this.complete) return
    const elapsed = performance.now() - this.start
    const progress = ease((Math.max(Math.min(elapsed / this.duration, 1), 0)), this.easing)
    this.method({ progress, stop: this.stop.bind(this) })
    if (progress === 1 && typeof this.resolve === 'function') this.stop()
  }

  stop () {
    this.complete = true
    this.resolve()
  }
}

function _tick () {
  _instances.forEach(instance => instance.tick())
  _instances = _instances.filter(instance => instance.complete === false)
  if (_instances.length) {
    requestAnimationFrame(_tick)
  } else {
    _running = false
  }
}

export function timer (duration, method, easing = 'linear') {
  if (!_running) {
    requestAnimationFrame(_tick)
    _running = true
  }

  return new Promise(resolve => {
    const tween = new Timer(duration, method, easing, resolve)
    _instances.push(tween)
  })
}