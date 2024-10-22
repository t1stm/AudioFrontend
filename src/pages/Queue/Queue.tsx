import { useAppSelector } from "../../state/hooks"
import QueueEntry from "./QueueEntry"
import "./Queue.scss"

const Queue = () => {
  const { queue, currentIndex } = useAppSelector(state => {
    return {
      queue: state.player.queue,
      currentIndex: state.player.currentIndex
    }
  });

  return <div className="queue">
    <div className="queue-entries">
      {
        queue.objects.map((entry, index) =>
        (<QueueEntry key={index} queueObject={entry} index={index} isCurrent={index === currentIndex} />))
      }
    </div>
  </div>;
}

export default Queue;