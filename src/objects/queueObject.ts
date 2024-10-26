import type { PlatformInfo } from "../pages/Search/SearchViewUtils"

export interface QueueObject {
  platform: PlatformInfo
  title: string
  artist: string
  totalSeconds: number
  image: string
  url: string
}
