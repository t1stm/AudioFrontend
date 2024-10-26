import "./VolumeBar.scss"
import type React from "react"
import { useCallback } from "react"
import { VolumeDownFill, VolumeMuteFill, VolumeOffFill, VolumeUpFill } from "react-bootstrap-icons"
import { useAppDispatch, useAppSelector } from "../../../state/hooks"
import type { RootState } from "../../../state/store"
import { toggleMute } from "../../../state/player/playerSlice"

export interface VolumeBarProps {
  onChange: (volume: number) => void
  onChangeDelta: (delta: number) => void
}

const VolumeBar: React.FC<VolumeBarProps> = (props) => {
  const { onChange, onChangeDelta } = props
  const { volume, muted } = useAppSelector((state: RootState) => {
    return {
      volume: state.player.volume,
      muted: state.player.muted
    }
  })
  const dispatch = useAppDispatch()

  const onIconClick = () => {
    dispatch(toggleMute())
  };

  const tempVolume = muted ? 0 : volume

  const volumeIcon =
    tempVolume > .50 ?
      <VolumeUpFill size={24} onClick={onIconClick}/> :
    tempVolume > .16 ?
      <VolumeDownFill size={24} onClick={onIconClick}/> :
    tempVolume > 0 ?
      <VolumeOffFill size={24} onClick={onIconClick}/> :
      <VolumeMuteFill size={24} onClick={onIconClick}/>

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {

    const rect = e.currentTarget.getBoundingClientRect()
    const currentY = rect.bottom - e.clientY
    const divHeight = rect.height
    const percentage = currentY / divHeight
    const clamped = Math.max(Math.min(percentage, 1), 0)

    onChange(clamped)
  }, [onChange])

  const handleWheel = useCallback((delta: number) => {
    const step = -delta / 1500;
    onChangeDelta(step);
  }, [onChangeDelta])

  const blipStyle = {
    bottom: `${ tempVolume * 100 }%`
  }

  return (
    <div className="volume-box" onWheel={(e) => {
      handleWheel(e.deltaY)
    }}>
      { volumeIcon }
      <div className="volume-bar" onClick={handleClick}>
        <div className="volume-blip" style={blipStyle}></div>
      </div>
    </div>
  )
}

export default VolumeBar;