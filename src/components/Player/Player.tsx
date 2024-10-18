import type { AppDispatch, RootState } from "../../state/store"
import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import {
  nextTrackAsync,
  playPauseAsync,
  previousTrackAsync,
  shuffleAsync,
  stopAsync,
  updateBuffer,
  updateTime,
} from "../../state/player/playerSlice"
import { PlayerProgressBar } from "./Progress Bar/PlayerProgressBar"
import { Audio } from "./Audio"

function getTimeString(seconds: number) {
  const date = new Date(0)
  date.setSeconds(seconds)
  return date.toISOString().substring(11, 19)
}

const Player = () => {
  const {
    title,
    artist,
    currentSeconds,
    bufferedSeconds,
    totalSeconds,
    image,
    playing,
    url,
    seekToSeconds,
  } = useAppSelector((state: RootState) => {
    return {
      title: state.player.current.title,
      artist: state.player.current.artist,
      totalSeconds: state.player.current.totalSeconds,
      image: state.player.current.image,
      url: state.player.current.url,

      currentSeconds: state.player.currentSeconds,
      bufferedSeconds: state.player.bufferedSeconds,
      playing: state.player.playing,
      seekToSeconds: state.player.seekToSeconds,
    }
  })
  const dispatch = useAppDispatch<AppDispatch>()

  const currentTime = getTimeString(currentSeconds)
  const totalTime = getTimeString(totalSeconds)
  const buttons = [
    {
      name: "stop",
      clickAction: () => dispatch(stopAsync())
    },
    {
      name: "back",
      clickAction: () => dispatch(previousTrackAsync()),
    },
    {
      name: playing ? "play" : "pause",
      clickAction: () => dispatch(playPauseAsync()),
    },
    {
      name: "next",
      clickAction: () => dispatch(nextTrackAsync()),
    },
    {
      name: "shuffle",
      clickAction: () => dispatch(shuffleAsync())
    },
  ];

  return (
    <div id="player">
      <div className="player-image-box">
        <img className="player-image" src={image} alt="Playing Thumbnail"></img>
      </div>
      <span className="title">{title}</span>
      <span className="artist">{artist}</span>

      <span className="player-progress">
        <span className="time current-time">{currentTime}</span>
        <PlayerProgressBar
          currentSeconds={currentSeconds}
          bufferedSeconds={bufferedSeconds}
          totalSeconds={totalSeconds}
        ></PlayerProgressBar>
        <span className="time total-time">{totalTime}</span>
      </span>

      <div className="player-buttons">
        {buttons.map(({name, clickAction}) => {
          return (
            <img
              src={`/static/icons/${name}.png`}
              className={`${name}-button`}
              alt={`${name} button`}
              onClick={clickAction}
            ></img>
          )
        })}
      </div>

      <Audio
        playing={playing}
        seekTime={seekToSeconds}
        url={url}
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
        onLoadedData={event => {
          const player = event.currentTarget
          dispatch(updateBuffer({ buffer: player.duration }))
        }}
      />
    </div>
  )
}

export default Player