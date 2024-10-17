import type React from "react"
import "./ProgressBar.scss"

export interface ProgressBarProps {
  currentSeconds: number,
  bufferedSeconds: number,
  totalSeconds: number,
}

export const ProgressBar: React.FC<ProgressBarProps> = (
  { currentSeconds, bufferedSeconds, totalSeconds }) => {
  let buffered_style = {
    width: `${(100 * bufferedSeconds) / totalSeconds}%`,
  }

  let current_style = {
    width: `${(100 * currentSeconds) / totalSeconds}%`,
  }

  return (
    <div className="progress-bar">
      <div className="progress-bar-buffered" style={buffered_style}></div>
      <div className="progress-bar-current" style={current_style}>
        <div className="playing-blip"></div>
      </div>
    </div>
  )
}