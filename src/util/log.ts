export function log(namespace: string, label: string, data: unknown) {
  const lines = '---------------------------------'
  console.log(`\n${lines}\n${namespace}:${label}\n${lines}\n`, data)
}
