export async function attempt(asyncMethod: Function) {
  try {
    const response = await asyncMethod()
    return { success: true, response }
  } catch (error) {
    return { success: false, error }
  }
}
