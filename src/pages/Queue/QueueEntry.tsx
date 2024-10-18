import type React from "react"
import type { QueueObject } from "../../state/player/queue"

interface QueueEntryProps {
  queueObject: QueueObject,
  index: number
}

const QueueEntry: React.FC<QueueEntryProps> = (props: QueueEntryProps) => {
  const { queueObject, index } = props;
  return (
    <div>

    </div>
  );
}

export default QueueEntry;