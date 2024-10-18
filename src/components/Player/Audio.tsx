import type React from "react"
import type { SyntheticEvent } from "react"
import { useEffect, useRef } from "react"

interface AudioParams {
  url: string
  playing: boolean
  seekTime: number
  onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>) => void
  onLoadedData: (event: SyntheticEvent<HTMLAudioElement>) => void
  onBuffer: (event: SyntheticEvent<HTMLAudioElement>) => void
}

export const Audio: React.FC<AudioParams> = ({
  url,
  playing,
  seekTime,
  onTimeUpdate,
  onLoadedData,
  onBuffer,
}) => {
  const ref = useRef<null | HTMLAudioElement>(null)
  playing ? ref.current?.play().then() : ref.current?.pause()

  useEffect(() => {
    if (ref.current != null) ref.current.currentTime = seekTime
  }, [seekTime])

  return (
    <audio
      ref={ref}
      src={url}
      onTimeUpdate={onTimeUpdate}
      onProgress={onBuffer}
      onCanPlayThrough={onLoadedData}
    ></audio>
  )
}