import React, { useRef } from "react"
import { useState } from "react"
import "./PlayerProgressBar.scss"

export interface PlayerProgress {
  currentSeconds: number,
  bufferedSeconds: number,
  totalSeconds: number,
}

function getWidthFromParams(current: number, total: number): React.CSSProperties {
  return {
    width: `${100 * current / total}%`,
  }
}

export const PlayerProgressBar: React.FC<PlayerProgress> = (
  { currentSeconds, bufferedSeconds, totalSeconds }) => {
  const buffered_style = getWidthFromParams(bufferedSeconds, totalSeconds)
  const current_style = getWidthFromParams(currentSeconds, totalSeconds)

  const divRef = useRef<HTMLDivElement | null>(null)
  const [blipLeft, setBlipLeft] = useState(0)

  return (
    <div ref={divRef} className="progress-bar" onMouseOver={(e) => {
      const currentX = e.nativeEvent.offsetX;
      const divWidth = e.currentTarget.clientWidth;
      setBlipLeft(100 * currentX / divWidth)
    }}>
      <div className="progress-bar-buffered" style={buffered_style}></div>
      <div className="progress-bar-current" style={current_style}></div>
      <div className="playing-blip" style={{
          left: `${blipLeft}%`
      }}></div>
    </div>
  )
}