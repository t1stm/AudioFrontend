import { BACKEND_DOWNLOAD_ENDPOINT } from "../../config"
import type { SearchObject } from "../../state/search/searchObject"
import type { QueueObject } from "../../objects/queueObject"
import emptyImage from "/static/images/empty.png"

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

export function getThumbnail(thumbnail: string | null) {
  return thumbnail !== null && thumbnail.length !== 0
    ? thumbnail
    : emptyImage
}

export function toQueueObject(object: SearchObject, bitrate: number, codec: string): QueueObject {
  const platformInfo = getPlatformNameFromIdentifier(object.ID);
  const thumbnail = getThumbnail(object.ThumbnailUrl);

  return generateQueueObject(object, bitrate, codec, thumbnail, platformInfo);
}

export function generateQueueObject(
  object: SearchObject,
  bitrate: number,
  codec: string,
  thumbnail: string,
  info: PlatformInfo,
): QueueObject {
  const { Name, Artist, Duration, ID } = object;
  const randomHash = Math.random().toString(36).substring(2, 5)

  return {
    title: Name ?? "",
    artist: Artist ?? "",
    totalSeconds: convertTimeSpanStringToSeconds(Duration),
    image: thumbnail,
    url: `${BACKEND_DOWNLOAD_ENDPOINT}/${codec}/${bitrate}?id=${encodeURI(ID)}#random_hash=${randomHash}`,
    platform: info,
  }
}