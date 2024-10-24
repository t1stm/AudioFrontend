import type { AppDispatch, RootState } from "../../state/store"
import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import {
  updateBuffer,
  updateTime,
  setCurrent,
  setPlaying,
  stop, seekTo
} from "../../state/player/playerSlice"

import { previousTrack, nextTrack, shuffle } from "../../state/queue/queueSlice"

import { PlayerProgressBar } from "./Progress Bar/PlayerProgressBar"
import { Audio } from "./Audio"
import { getTimeString } from "./PlayerViewUtils"
import MediaSession from "./Information/MediaSession"

import stopImage from "/static/icons/stop.png"
import backImage from "/static/icons/back.png"
import playImage from "/static/icons/play.png"
import pauseImage from "/static/icons/pause.png"
import nextImage from "/static/icons/next.png"
import shuffleImage from "/static/icons/shuffle.png"
import emptyImage from "/static/images/empty.png"
import { useEffect } from "react"

const Player = () => {
  const { queue, player } = useAppSelector((state: RootState) => {
    let image = state.player.current.image
    if (image.length === 0) {
      image = emptyImage
    }

    return {
      queue: {
        currentIndex: state.queue.currentIndex,
        objects: state.queue.objects,
      },
      player: {
        title: state.player.current.title,
        artist: state.player.current.artist,
        totalSeconds: state.player.current.totalSeconds,
        image: image,
        url: state.player.current.url,

        currentSeconds: state.player.currentSeconds,
        bufferedSeconds: state.player.bufferedSeconds,
        playing: state.player.playing,
        seekToSeconds: state.player.seekToSeconds,
        volume: state.player.volume,
        currentIndex: state.queue.currentIndex,
      },
    }
  })
  const dispatch = useAppDispatch<AppDispatch>()

  const currentTime = getTimeString(player.currentSeconds ?? 0)
  const totalTime = getTimeString(player.totalSeconds ?? 0)

  useEffect(() => {
    if (queue.currentIndex < 0 || queue.currentIndex >= queue.objects.length)
      return

    const current = queue.objects[queue.currentIndex]
    dispatch(setCurrent(current))
  }, [queue.objects, queue.currentIndex, dispatch])

  const buttons = [
    {
      name: "stop",
      imageUrl: stopImage,
      clickAction: () => dispatch(stop()),
    },
    {
      name: "back",
      imageUrl: backImage,
      clickAction: () => dispatch(previousTrack()),
    },
    {
      name: player.playing ? "play" : "pause",
      imageUrl: player.playing ? playImage : pauseImage,
      clickAction: () => dispatch(setPlaying(!player.playing)),
    },
    {
      name: "next",
      imageUrl: nextImage,
      clickAction: () => dispatch(nextTrack()),
    },
    {
      name: "shuffle",
      imageUrl: shuffleImage,
      clickAction: () => dispatch(shuffle()),
    },
  ]

  return (
    <div id="player">
      <div className="player-song-info">
        <div className="player-image-box">
          <img className="player-image" src={player.image} alt=""></img>
        </div>
        <div className="player-info">
          <span className="title">{player.title}</span>
          <span className="artist">{player.artist}</span>
        </div>
      </div>

      <span className="player-progress">
        <span className="time current-time">{currentTime}</span>
        <PlayerProgressBar
          currentSeconds={player.currentSeconds}
          bufferedSeconds={player.bufferedSeconds}
          totalSeconds={player.totalSeconds}
          onClick={(percentage) => {
            dispatch(seekTo(percentage * player.totalSeconds))
          }}
        ></PlayerProgressBar>
        <span className="time total-time">{totalTime}</span>
      </span>

      <div className="player-buttons">
        {buttons.map(({ name, clickAction, imageUrl }) => {
          return (
            <img
              key={name}
              src={imageUrl}
              className={`${name}-button`}
              alt={`${name} button`}
              onClick={clickAction}
            ></img>
          )
        })}
      </div>

      <MediaSession
        title={player.title}
        artist={player.artist}
        currentSeconds={player.currentSeconds}
        totalSeconds={player.totalSeconds}
        playing={player.playing}
        thumbnail={player.image}
        currentFormatted={currentTime}
        totalFormatted={totalTime}
      />

      <Audio
        playing={player.playing}
        seekTime={player.seekToSeconds}
        url={player.url}
        volume={player.volume}
        onTimeUpdate={event => {
          const player = event.currentTarget
          const time = player.currentTime
          dispatch(updateTime({ time: time }))
        }}
        onBuffer={event => {
          const player = event.currentTarget
          const buffer = player.buffered
          if (buffer.length < 1) return

          const end = buffer.end(buffer.length - 1)
          dispatch(updateBuffer({ buffer: end }))
        }}
        onCanPlayThrough={() => {
          dispatch(updateBuffer({ buffer: player.totalSeconds }))
        }}
        onEnded={() => {
          console.log("Ended current audio.")
          dispatch(nextTrack())
        }}
      />
    </div>
  )
}

export default Player
