export function convertTimeSpanStringToSeconds(dateString: string): number {
  return dateString
    .split(':')
    .reverse()
    .reduce(
      (previous, current, i) =>
        previous + Number.parseInt(current) * Math.pow(60, i), 0
    )
}