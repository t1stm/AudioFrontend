import { useAppSelector } from "../../state/hooks"
import QueueEntry from "./QueueEntry"

const Queue = () => {
  const { queue } = useAppSelector(state => {
    return {
      queue: state.player.queue
    }
  });

  return <div className="queue">
    <div className="queue-entries">
      {
        queue.objects.map((entry, index) =>
        (<QueueEntry key={index} queueObject={entry} index={index} />))
      }
    </div>
  </div>;
}

export default Queue;