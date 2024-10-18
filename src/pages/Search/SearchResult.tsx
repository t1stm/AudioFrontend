import type React from "react"
import type { SearchObject } from "../../state/search/searchObject"
import { useAppDispatch } from "../../state/hooks"
import type { AppDispatch } from "../../state/store"
import {
  convertTimeSpanStringToSeconds,
  getPlatformNameFromIdentifier
} from "./searchUtils"
import { addToQueueAsync } from "../../state/player/playerSlice"

const downloadEndpoint = "http://localhost:5226/Audio/Download"
let codec = "Opus"
let bitrate = "192"

export const SearchResult: 
  React.FC<SearchObject> = ({
    ID,
    Name,
    Artist,
    Duration,
    ThumbnailUrl
  }) => {
  const dispatch = useAppDispatch<AppDispatch>()
  const info = getPlatformNameFromIdentifier(ID)

  return (
    <div className="search-result">
      <img src={ThumbnailUrl ?? ""} alt="Thumbnail" />
      <div className="result-names">
        <span className="result-title">{Name}</span>
        <span className="result-artist">{Artist}</span>
      </div>
      <div>
        <div
          className="platform-blip"
          style={{
            background: info.color ?? "",
          }}
        >
          {info.prettyName}
        </div>
        <span className="result-duration">{Duration}</span>
      </div>
      <button
        onClick={() =>
          dispatch(
            addToQueueAsync({
              title: Name ?? "",
              artist: Artist ?? "",
              totalSeconds: convertTimeSpanStringToSeconds(Duration),
              image: ThumbnailUrl ?? "",
              url: `${downloadEndpoint}/${codec}/${bitrate}?id=${encodeURI(ID)}`,
            }),
          )
        }
      >
        Add to Queue
      </button>
    </div>
  )
}