import type React from "react";
import { useRef, useEffect } from "react"
import { useAppDispatch } from "../../../state/hooks"
import { seekOffset, seekTo, setPlaying, stop } from "../../../state/player/playerSlice"
import { nextTrack, previousTrack } from "../../../state/queue/queueSlice"
import playerService from "../../../state/websockets/playerService"

interface InfoUpdaterProps {
  title: string
  artist: string
  currentSeconds: number
  totalSeconds: number
  playing: boolean | null
  thumbnail: string
  currentFormatted: string
  totalFormatted: string
}

const MediaSession: React.FC<InfoUpdaterProps> = ({
  title,
  artist,
  currentSeconds,
  totalSeconds,
  playing,
  thumbnail,
  currentFormatted,
}) => {
  const ref = useRef<number>(8)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: "Audio API",
      artwork: [{ src: thumbnail }],
    })
  }, [title, artist, thumbnail])

  useEffect(() => {
    if (!("mediaSession" in navigator) || currentSeconds >= totalSeconds) return
    if (ref.current === null || ++ref.current < 8) return
    ref.current = 0

    navigator.mediaSession.setPositionState({
      duration: totalSeconds + 1,
      playbackRate: 1,
      position: currentSeconds,
    })
  }, [currentSeconds, totalSeconds])

  useEffect(() => {
    if (playing == null || !("mediaSession" in navigator)) return
    navigator.mediaSession.playbackState = playing ? "playing" : "paused"
  }, [playing])

  useEffect(() => {
    if (!("title" in document)) return
    document.title = `[Audio Player]: (${currentFormatted}) ${title} - ${artist}`
  }, [title, artist, currentFormatted])

  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    const actions = {
      "play": () => {
        playerService.isConnected() ?
          playerService.send("playpause")
          : dispatch(setPlaying(true))
      },
      "pause": () => {
        playerService.isConnected() ?
          playerService.send("playpause")
          : dispatch(setPlaying(false))
      },
      "stop": () => {
        playerService.isConnected() ?
          playerService.send("stop")
          : dispatch(stop())
      },
      "nexttrack": () => {
        playerService.isConnected() ?
          playerService.send("next")
          : dispatch(nextTrack())
      },
      "previoustrack": () => {
        playerService.isConnected() ?
          playerService.send("previous")
          : dispatch(previousTrack())
      },
      "seekto": (details: MediaSessionActionDetails) => {
        if (!details.seekTime) return
        playerService.isConnected() ?
          playerService.send(`seek ${details.seekTime}`)
          : dispatch(seekTo(details.seekTime))
      },
      "seekforward": (details: MediaSessionActionDetails) => {
        dispatch(seekOffset(details.seekOffset || 5))
      },
      "seekbackward": (details: MediaSessionActionDetails) => {
        dispatch(seekOffset(-(details.seekOffset || 5)))
      },
    }

    for (const [action, handler] of Object.entries(actions)) {
      navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler)
    }

    return () => {
      for (const action of Object.keys(actions)) {
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, null)
      }
    }
  }, [dispatch])

  return <></>
}

export default MediaSession
