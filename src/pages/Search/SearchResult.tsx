import type React from "react"
import type { SearchObject } from "../../state/search/searchObject"
import { useAppDispatch } from "../../state/hooks"
import type { AppDispatch } from "../../state/store"
import {
  convertTimeSpanStringToSeconds,
  getPlatformNameFromIdentifier,
} from "./SearchViewUtils"
import "./SearchResult.scss"
import PlatformBlip from "../../components/Platform Blip/PlatformBlip"
import emptyImage from "/static/images/empty.png"
import { BACKEND_DOWNLOAD_ENDPOINT } from "../../config"
import { addToQueue } from "../../state/queue/queueSlice"

let codec = "Opus"
let bitrate = "192"

export const SearchResult: React.FC<SearchObject> = ({
  ID,
  Name,
  Artist,
  Duration,
  ThumbnailUrl,
}) => {
  const dispatch = useAppDispatch<AppDispatch>()
  const info = getPlatformNameFromIdentifier(ID)

  const thumbnail =
    ThumbnailUrl !== null && ThumbnailUrl.length !== 0
      ? ThumbnailUrl
      : emptyImage

  return (
    <div key={ID} className="search-result">
      <img src={thumbnail} alt="Thumbnail" />
      <div className="result-names">
        <span className="result-title">{Name}</span>
        <span className="result-artist">{Artist}</span>
      </div>
      <div className="result-info">
        <PlatformBlip color={info.color} prettyName={info.prettyName} />
        <span className="result-duration">{Duration}</span>
      </div>
      <button
        onClick={() => {
          // when skipping between to identical entries in the queue,
          // the src isn't changed so the player doesn't reset the playback.

          // this fixes that without making new requests if caching is enabled
          const random_hash = crypto.randomUUID()
          dispatch(
            addToQueue({
              title: Name ?? "",
              artist: Artist ?? "",
              totalSeconds: convertTimeSpanStringToSeconds(Duration),
              image: thumbnail,
              url: `${BACKEND_DOWNLOAD_ENDPOINT}/${codec}/${bitrate}?id=${encodeURI(ID)}#random_hash=${random_hash}`,
              platform: info,
            }),
          )
        }}
      >
        Add to Queue
      </button>
    </div>
  )
}
