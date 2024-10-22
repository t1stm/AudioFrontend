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

const MediaSession: React.FC<InfoUpdaterProps> = ({title, artist, currentSeconds, totalSeconds, playing, thumbnail, currentFormatted}) => {
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
    if (!('mediaSession' in navigator) || currentSeconds >= totalSeconds) return;
    navigator.mediaSession.setPositionState({
      duration: totalSeconds + 1,
      playbackRate: 1,
      position: currentSeconds - currentSeconds % 1
    })
  }, [currentSeconds, totalSeconds])

  useEffect(() => {
    if (playing == null || !('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [playing])

  useEffect(() => {
    if (!('title' in document)) return
    document.title = `[Audio Player]: (${currentFormatted}) ${title} - ${artist}`;
  }, [title, artist, currentFormatted])

  return (<></>)
}

export default MediaSession;