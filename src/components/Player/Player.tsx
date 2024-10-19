import type { AppDispatch, RootState } from "../../state/store"
import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import {
  endedAsync,
  nextTrackAsync,
  playPauseAsync,
  previousTrackAsync,
  shuffleAsync,
  stopAsync,
  updateBuffer,
  updateTime
} from "../../state/player/playerSlice"
import { PlayerProgressBar } from "./Progress Bar/PlayerProgressBar"
import { Audio } from "./Audio"
import { getTimeString } from "./playerUtils"

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
    volume
  } = useAppSelector((state: RootState) => {
    let image = state.player.current.image
    if (image.length === 0) {
      image = "/static/images/empty.png"
    }

    return {
      title: state.player.current.title,
      artist: state.player.current.artist,
      totalSeconds: state.player.current.totalSeconds,
      image: image,
      url: state.player.current.url,

      currentSeconds: state.player.currentSeconds,
      bufferedSeconds: state.player.bufferedSeconds,
      playing: state.player.playing,
      seekToSeconds: state.player.seekToSeconds,
      volume: state.player.volume
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
      clickAction: () => dispatch(playPauseAsync(null)),
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
      <div className="player-song-info">
        <div className="player-image-box">
          <img className="player-image" src={image} alt=""></img>
        </div>
        <div className="player-info">
          <span className="title">{title}</span>
          <span className="artist">{artist}</span>
        </div>
      </div>

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
        {buttons.map(({ name, clickAction }) => {
          return (
            <img
              key={name}
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
        volume={volume}
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
          dispatch(updateBuffer({ buffer: totalSeconds }))
        }}
        onEnded={() => {
          console.log("Ended current audio.")
          dispatch(endedAsync())
        }}
      />
    </div>
  )
}

export default Player