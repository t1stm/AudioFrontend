import type React from "react"
import type { SearchObject } from "../../state/search/searchObject"
import { useAppDispatch } from "../../state/hooks"
import type { AppDispatch } from "../../state/store"
import {
  convertTimeSpanStringToSeconds,
  getPlatformNameFromIdentifier
} from "./SearchViewUtils"
import { addToQueueAsync } from "../../state/player/playerSlice"
import "./SearchResult.scss"
import PlatformBlip from "../../components/Platform Blip/PlatformBlip"

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

  const thumbnail = ThumbnailUrl !== null && ThumbnailUrl.length !== 0 ? ThumbnailUrl : "/static/images/empty.png"

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
        onClick={() =>
          dispatch(
            addToQueueAsync({
              title: Name ?? "",
              artist: Artist ?? "",
              totalSeconds: convertTimeSpanStringToSeconds(Duration),
              image: thumbnail,
              url: `${downloadEndpoint}/${codec}/${bitrate}?id=${encodeURI(ID)}`,
              platform: info
            }),
          )
        }
      >
        Add to Queue
      </button>
    </div>
  )
}