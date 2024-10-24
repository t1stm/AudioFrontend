export interface PlatformInfo {
  identifier: string
  prettyName: string
  color: string | null
}

export function convertTimeSpanStringToSeconds(dateString: string): number {
  return dateString
    .split(":")
    .reverse()
    .reduce(
      (previous, current, i) =>
        previous + Number.parseInt(current) * Math.pow(60, i),
      0,
    )
}

export function getPlatformNameFromIdentifier(id: string): PlatformInfo {
  const split = id.split(":")
  const identifier = split[0]

  let prettyName = "Unknown"
  let color: string | null = null
  switch (identifier) {
    case "yt":
      prettyName = "YouTube"
      color = "red"
      break

    case "audio":
      prettyName = "Local"
      color = "blue"
      break

    case "spotify":
      prettyName = "Spotify"
      color = "green"
      break
  }

  return {
    identifier: identifier,
    prettyName: prettyName,
    color: color,
  }
}
