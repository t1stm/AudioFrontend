import { useAppDispatch, useAppSelector } from "../../state/hooks"
import QueueEntry from "./QueueEntry"
import "./Queue.scss"
import { setCurrentIndex, setNext } from "../../state/queue/queueSlice"

const Queue = () => {
  const { objects, currentIndex } = useAppSelector(state => {
    return {
      objects: state.queue.objects,
      currentIndex: state.queue.currentIndex,
    }
  })

  const dispatch = useAppDispatch()
  return (
    <div className="queue">
      <div className="queue-entries">
        {objects.map((entry, index) => (
          <QueueEntry
            key={entry.url}
            queueObject={entry}
            index={index}
            isCurrent={index === currentIndex}
            setNext={index => {
              dispatch(setNext(index))
            }}
            skipTo={index => {
              dispatch(setCurrentIndex(index))
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Queue
