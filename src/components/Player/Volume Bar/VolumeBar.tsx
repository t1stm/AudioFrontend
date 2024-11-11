import "./VolumeBar.scss"
import type React from "react"
import { useCallback, useState, useEffect } from "react"
import {
  VolumeDownFill,
  VolumeMuteFill,
  VolumeOffFill,
  VolumeUpFill,
} from "react-bootstrap-icons"
import { useAppDispatch, useAppSelector } from "../../../state/hooks"
import type { RootState } from "../../../state/store"
import { toggleMute } from "../../../state/player/playerSlice"

export interface VolumeBarProps {
  onChange: (volume: number) => void
  onChangeDelta: (delta: number) => void
}

const VolumeBar: React.FC<VolumeBarProps> = props => {
  const { onChange, onChangeDelta } = props
  const { volume, muted } = useAppSelector((state: RootState) => ({
    volume: state.player.volume,
    muted: state.player.muted,
  }))
  const dispatch = useAppDispatch()
  const [isDragging, setIsDragging] = useState(false)

  const onIconClick = () => {
    dispatch(toggleMute())
  }

  const tempVolume = muted ? 0 : volume

  const volumeIcon =
    tempVolume > 0.5 ? (
      <VolumeUpFill size={24} onClick={onIconClick} />
    ) : tempVolume > 0.16 ? (
      <VolumeDownFill size={24} onClick={onIconClick} />
    ) : tempVolume > 0 ? (
      <VolumeOffFill size={24} onClick={onIconClick} />
    ) : (
      <VolumeMuteFill size={24} onClick={onIconClick} />
    )

  const handleVolumeChange = useCallback((clientY: number, rect: DOMRect) => {
    const currentY = rect.bottom - clientY
    const divHeight = rect.height
    const percentage = currentY / divHeight
    const clamped = Math.max(Math.min(percentage, 1), 0)
    onChange(clamped)
  }, [onChange])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setIsDragging(true)
      handleVolumeChange(e.clientY, rect)
    },
    [handleVolumeChange],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const rect = document
          .querySelector(".volume-bar")!
          .getBoundingClientRect()
        handleVolumeChange(e.clientY, rect)
      }
    },
    [handleVolumeChange, isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (delta: number) => {
      const step = -delta / 1500
      onChangeDelta(step)
    },
    [onChangeDelta],
  )

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const blipStyle = {
    bottom: `${tempVolume * 100}%`,
  }

  return (
    <div className="volume-box" onWheel={e => handleWheel(e.deltaY)}>
      {volumeIcon}
      <div className="volume-bar" onMouseDown={handleMouseDown}>
        <div className="volume-blip" style={blipStyle}></div>
      </div>
    </div>
  )
}

export default VolumeBar
