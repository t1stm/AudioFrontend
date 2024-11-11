import type React from "react";
import { useCallback } from "react"
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

export const SearchResult: React.FC<{object: SearchObject, bitrate: number, codec: string}> = ({object, bitrate, codec}) => {
  const {
    ID,
    Name,
    Artist,
    Duration,
    ThumbnailUrl,
  } = object

  const dispatch = useAppDispatch<AppDispatch>()
  const info = getPlatformNameFromIdentifier(ID)

  const thumbnail = getThumbnail(ThumbnailUrl);
  const addCallback = useCallback(() => {
    if (playerService.isConnected()) {
      playerService.send(`add ${ID}`)
      return
    }

    dispatch(addToQueue(generateQueueObject(object, bitrate, codec, thumbnail, info)))
  }, [ID, bitrate, codec, dispatch, info, object, thumbnail])

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
      <button onClick={addCallback}>Add to Queue</button>
    </div>
  )
}
