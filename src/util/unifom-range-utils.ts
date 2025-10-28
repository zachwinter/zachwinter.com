const INTEGER_KEYS = ['sides']
const LOW_KEYS = [
  'contrast',
  'ballSize',
  'orbSize',
  'multiplier',
  'brightness',
  'colorSpread',
  'glow'
]
const MED_KEYS = ['iterator']
const HIGH_KEYS = ['radius', 'zoom', 'colorMultiplier', 'colorSpread']

function getTemp(key: string, temp: number = 0.7) {
  if (LOW_KEYS.includes(key)) return temp / 8
  if (MED_KEYS.includes(key)) return temp / 3
  if (HIGH_KEYS.includes(key)) return temp / 1.5
  return temp
}

function isIntegerKey(key: string) {
  return INTEGER_KEYS.includes(key)
}

function getMin(key: any, n: number, temp = 0.7) {
  if (isIntegerKey(key)) return 1
  return n - getTemp(key, temp) * n
}

function getMax(key: any, n: number, temp = 0.7) {
  if (isIntegerKey(key)) return 12
  return n + getTemp(key, temp) * n
}

function getStep(key: any, n: number) {
  return isIntegerKey(key) ? 1 : 0
}

export const uniformRangeUtils = {
  getMin,
  getMax,
  getStep
}
