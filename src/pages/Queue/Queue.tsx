import { useAppDispatch, useAppSelector } from "../../state/hooks"
import QueueEntry from "./QueueEntry"
import "./Queue.scss"
import { setCurrentIndex, setNext } from "../../state/queue/queueSlice"
import type { RootState } from "../../state/store"
import playerService from "../../state/websockets/playerService"

const Queue = () => {
  const { objects, currentIndex } = useAppSelector((state: RootState) => {
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
              playerService.isConnected() ?
                playerService.send(`setnext ${index}`)
                : dispatch(setNext(index))
            }}
            skipTo={index => {
              playerService.isConnected() ?
                playerService.send(`skipto ${index}`)
                : dispatch(setCurrentIndex(index))
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Queue
