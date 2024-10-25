import type React from "react"
import { useRef, useState, useCallback } from "react"
import "./PlayerProgressBar.scss"

export interface PlayerProgress {
  currentSeconds: number
  bufferedSeconds: number
  totalSeconds: number
  onClick: (percent: number) => void
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
  onClick,
}) => {
  const buffered_style = getWidthFromParams(bufferedSeconds, totalSeconds)
  const current_style = getWidthFromParams(currentSeconds, totalSeconds)

  const divRef = useRef<HTMLDivElement | null>(null)
  const [blipLeft, setBlipLeft] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const divElement = divRef.current
    if (!divElement) return

    const rect = divElement.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const divWidth = rect.width
    const percentage = currentX / divWidth
    const clamped = Math.max(Math.min(percentage, 1), 0)
    setBlipLeft(clamped)
  }, [])

  return (
    <div
      ref={divRef}
      className="progress-bar"
      onMouseMove={handleMouseMove}
      onClick={() => onClick(blipLeft)}
    >
      <div className="progress-bar-buffered" style={buffered_style}></div>
      <div className="progress-bar-current" style={current_style}></div>
      <div
        className="playing-blip"
        style={{
          left: `${100 * blipLeft}%`,
        }}
      ></div>
    </div>
  )
}
