import type React from "react"
import type { QueueObject } from "../../state/player/queue"
import "./QueueEntry.scss"

interface QueueEntryProps {
  queueObject: QueueObject,
  index: number
}

const QueueEntry: React.FC<QueueEntryProps> = (props: QueueEntryProps) => {
  const { queueObject, index } = props
  const { title, artist, totalSeconds, image, url } = queueObject

  return (
    <div className="queue-object">
      <span>#{index}</span>
      <span>{title}</span>
      <span>{artist}</span>
      <span>{totalSeconds}</span>
      <span>{image}</span>
      <span>{url}</span>
    </div>
  )
}

export default QueueEntry