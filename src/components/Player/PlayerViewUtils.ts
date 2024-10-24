export function getTimeString(seconds: number) {
  const date = new Date(0)
  date.setSeconds(seconds)
  return date.toISOString().substring(11, 19)
}
