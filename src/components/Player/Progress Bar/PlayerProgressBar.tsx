import type React from "react"
import { useRef, useState, useCallback } from "react"
import "./PlayerProgressBar.scss"

export interface PlayerProgress {
  currentSeconds: number
  bufferedSeconds: number
  totalSeconds: number
}

function getWidthFromParams(
  current: number,
  total: number,
): React.CSSProperties {
  return {
    width: `${(100 * current) / total}%`,
  }
}

export const PlayerProgressBar: React.FC<PlayerProgress> = ({
  currentSeconds,
  bufferedSeconds,
  totalSeconds,
}) => {
  const buffered_style = getWidthFromParams(bufferedSeconds, totalSeconds)
  const current_style = getWidthFromParams(currentSeconds, totalSeconds)

  const divRef = useRef<HTMLDivElement | null>(null)
  const [blipLeft, setBlipLeft] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const divElement = divRef.current
    if (divElement) {
      const rect = divElement.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const divWidth = rect.width
      setBlipLeft((100 * currentX) / divWidth)
    }
  }, [])

  return (
    <div ref={divRef} className="progress-bar" onMouseMove={handleMouseMove}>
      <div className="progress-bar-buffered" style={buffered_style}></div>
      <div className="progress-bar-current" style={current_style}></div>
      <div
        className="playing-blip"
        style={{
          left: `${blipLeft}%`,
        }}
      ></div>
    </div>
  )
}
