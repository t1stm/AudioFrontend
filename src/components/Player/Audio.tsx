import type React from "react"
import type { SyntheticEvent } from "react"
import { useRef } from "react"
import { useEffect } from "react"

interface AudioParams {
  url: string
  playing: boolean | null
  seekTime: number | null
  volume: number
  onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>) => void
  onCanPlayThrough: (event: SyntheticEvent<HTMLAudioElement>) => void
  onBuffer: (event: SyntheticEvent<HTMLAudioElement>) => void
  onEnded: (event: SyntheticEvent<HTMLAudioElement>) => void
}

export const Audio: React.FC<AudioParams> = ({
  url,
  playing,
  seekTime,
  volume,
  onTimeUpdate,
  onCanPlayThrough,
  onBuffer,
  onEnded,
}) => {
  const ref = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (playing == null) return
    playing ? ref.current?.play().then() : ref.current?.pause()
    console.log("Setting playback to: ", playing)
  }, [playing])

  useEffect(() => {
    if (ref.current == null || seekTime == null) return
    ref.current.currentTime = seekTime
    console.log("Seeking to: ", seekTime)
  }, [seekTime])

  useEffect(() => {
    if (ref.current != null) ref.current.volume = volume
    console.log("Setting volume to: ", volume)
  }, [volume])

  return (
    <audio
      ref={ref}
      src={url}
      autoPlay={playing ?? false}
      onTimeUpdate={onTimeUpdate}
      onProgress={onBuffer}
      onCanPlayThrough={onCanPlayThrough}
      loop={false}
      onEnded={onEnded}
    ></audio>
  )
}
