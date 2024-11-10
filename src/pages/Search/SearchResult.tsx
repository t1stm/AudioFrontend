import type React from "react"
import type { SearchObject } from "../../state/search/searchObject"
import { useAppDispatch } from "../../state/hooks"
import type { AppDispatch } from "../../state/store"
import {
  generateQueueObject,
  getPlatformNameFromIdentifier, getThumbnail
} from "./SearchViewUtils"
import "./SearchResult.scss"
import PlatformBlip from "../../components/Platform Blip/PlatformBlip"
import { addToQueue } from "../../state/queue/queueSlice"
import playerService from "../../state/websockets/playerService"

export const SearchResult: React.FC<SearchObject> = ({
  ID,
  Name,
  Artist,
  Duration,
  ThumbnailUrl,
}) => {
  const dispatch = useAppDispatch<AppDispatch>()
  const info = getPlatformNameFromIdentifier(ID)

  const thumbnail = getThumbnail(ThumbnailUrl);
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
          if (playerService.isConnected()) {
            playerService.send(`add ${ID}`)
            return
          }

          // when skipping between to identical entries in the queue,
          // the src isn't changed so the player doesn't reset the playback.

          // this fixes that without making new requests if caching is enabled

          dispatch(
            addToQueue(generateQueueObject({ Album: null, ThumbnailUrl, Name, Artist, Duration, ID }, thumbnail, info)),
          )
        }}
      >
        Add to Queue
      </button>
    </div>
  )
}
