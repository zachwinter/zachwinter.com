export function sample(array: any[]) {
  const length = array.length
  const index = Math.floor(Math.random() * length)
  return array[index]
}
