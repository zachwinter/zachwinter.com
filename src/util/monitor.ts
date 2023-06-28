let last = 0
let iterations = 0
let values: any = []

export function determineRefreshRate(): Promise<number> {
  return new Promise(resolve => {
    const tick = (now: DOMHighResTimeStamp) => {
      iterations++

      const value = 1000 / (now - last)
      values.push(value)

      if (iterations === 4) {
        last = 0
        iterations = 0
        values.shift()
        resolve(values.reduce((acc, val) => (acc += val), 0) / 3)
        values = []
        return
      } else {
        last = now
      }

      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}
