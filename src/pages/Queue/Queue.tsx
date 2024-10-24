import { useAppSelector } from "../../state/hooks"
import QueueEntry from "./QueueEntry"
import "./Queue.scss"

const Queue = () => {
  const { objects, currentIndex } = useAppSelector(state => {
    return {
      objects: state.queue.objects,
      currentIndex: state.queue.currentIndex
    }
  });

  return <div className="queue">
    <div className="queue-entries">
      {
        objects.map((entry, index) =>
        (<QueueEntry key={index} queueObject={entry} index={index} isCurrent={index === currentIndex} />))
      }
    </div>
  </div>;
}

export default Queue;