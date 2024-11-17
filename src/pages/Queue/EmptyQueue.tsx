import "./EmptyQueue.scss"
import type React from "react"

const EmptyQueue: React.FC = () => {
  return (
    <div className="empty-queue">
      <img alt={"Empty Queue icon"}/>
      <span>The queue is empty.</span>
      <span>Go add something to it.</span>
    </div>
  )
}

export default EmptyQueue