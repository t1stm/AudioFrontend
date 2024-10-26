import React from "react"
import type { SyntheticEvent } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import { CodecInfo, AAC, FLAC, MP3, Opus, Vorbis } from "../../objects/codecs"
import { useAppDispatch } from "../../state/hooks"
import { setBitrate, setCodec, setSupportedCodecs } from "../../state/settings/settingsSlice"

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
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (ref.current == null) return
    const audio = ref.current;

    // codecs here are ordered by most to least preferred
    const availableCodecs: CodecInfo[] = [
      Opus,
      AAC,
      Vorbis,
      MP3,
      FLAC
    ];

    const supportedCodecs: CodecInfo[] = [];

    for (const codec of availableCodecs) {
      if (audio.canPlayType(codec.type) !== "")
        supportedCodecs.push(codec);
    }

    dispatch(setSupportedCodecs(supportedCodecs))

    if (supportedCodecs.length < 1) return
    dispatch(setCodec(supportedCodecs[0]))
    dispatch(setBitrate(supportedCodecs[0].goodBitrate))
  }, [ref.current, dispatch])

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
