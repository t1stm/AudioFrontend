import type React from "react"
import { useEffect } from "react"

interface InfoUpdaterProps {
  title: string
  artist: string
  currentSeconds: number
  totalSeconds: number
  playing: boolean | null
  thumbnail: string
  currentFormatted: string,
  totalFormatted: string,
}

const MediaSession: React.FC<InfoUpdaterProps> = ({title, artist, currentSeconds, totalSeconds, playing, thumbnail, currentFormatted, totalFormatted}) => {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: "Audio API",
      artwork: [
        { src: thumbnail },
      ]
    })
  }, [title, artist, thumbnail])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setPositionState({
      duration: totalSeconds,
      playbackRate: 1,
      position: currentSeconds
    })
  }, [currentSeconds, totalSeconds])

  useEffect(() => {
    if (playing == null) return
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [playing])

  useEffect(() => {
    document.title = `[Audio Player]: (${currentFormatted}) ${title} - ${artist}`;
  }, [title, artist, currentFormatted])

  return (<></>)
}

export default MediaSession;