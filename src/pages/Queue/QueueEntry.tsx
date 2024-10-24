import type React from "react"
import type { QueueObject } from "../../state/player/queue"
import "./QueueEntry.scss"
import { getTimeString } from "../../components/Player/PlayerViewUtils"
import PlatformBlip from "../../components/Platform Blip/PlatformBlip"

interface QueueEntryProps {
  queueObject: QueueObject
  index: number
  isCurrent: boolean
}

const QueueEntry: React.FC<QueueEntryProps> = (props: QueueEntryProps) => {
  const { queueObject, index, isCurrent } = props
  const { title, artist, totalSeconds, image, platform } = queueObject

  return (
    <div className={`queue-entry ${isCurrent ? "queue-current" : ""}`}>
      <div className="queue-index-image">
        <span className="queue-index">#{index + 1}</span>
        <img src={image} alt="Thumbnail"></img>
      </div>
      <div className="queue-info">
        <span className="queue-title">{title}</span>
        <span className="queue-artist">{artist}</span>
      </div>
      <PlatformBlip color={platform.color} prettyName={platform.prettyName} />
      <span className="queue-total-length">{getTimeString(totalSeconds)}</span>
      <div className="queue-item-buttons">
        <button>Set Next</button>
        <button>Skip To</button>
      </div>
    </div>
  )
}

export default QueueEntry
