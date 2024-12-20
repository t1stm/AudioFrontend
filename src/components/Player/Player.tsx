import type { AppDispatch, RootState } from "../../state/store"
import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import {
  updateBuffer,
  updateTime,
  setCurrent,
  setPlaying,
  stop,
  seekTo, updateVolume, updateVolumeDelta, setSynced
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
import VolumeBar from "./Volume Bar/VolumeBar"
import PlayerSocket from "./Web Sockets/PlayerSocket"
import playerService from "../../state/websockets/playerService"

const Player = () => {
  const { queue, player } = useAppSelector((state: RootState) => {
    let image = state.player.current.image
    if (image?.length === 0) {
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
        muted: state.player.muted,
        currentIndex: state.player.currentIndex,
        initialSync: state.player.initialSync
      },
    }
  })
  const dispatch = useAppDispatch<AppDispatch>()

  const currentTime = getTimeString(player.currentSeconds ?? 0)
  const totalTime = getTimeString(player.totalSeconds ?? 0)

  useEffect(() => {
    if (queue.currentIndex < 0 || queue.currentIndex >= queue.objects.length)
      return
    if (queue.currentIndex === player.currentIndex) return

    const current = queue.objects[queue.currentIndex]
    dispatch(
      setCurrent({
        object: current,
        index: queue.currentIndex,
      }),
    )
    dispatch(setSynced(false))
  }, [dispatch, queue.objects, queue.currentIndex, player.currentIndex])

  const buttons = [
    {
      name: "stop",
      imageUrl: stopImage,
      clickAction: () => playerService.isConnected() ?
        playerService.send("stop")
        : dispatch(stop()),
    },
    {
      name: "back",
      imageUrl: backImage,
      clickAction: () => playerService.isConnected() ?
        playerService.send("previous")
        : dispatch(previousTrack()),
    },
    {
      name: player.playing ? "pause" : "play",
      imageUrl: player.playing ? pauseImage : playImage,
      clickAction: () => playerService.isConnected() ?
        playerService.send("playpause")
        : dispatch(setPlaying(!player.playing)),
    },
    {
      name: "next",
      imageUrl: nextImage,
      clickAction: () => playerService.isConnected() ?
        playerService.send("next")
        : dispatch(nextTrack()),
    },
    {
      name: "shuffle",
      imageUrl: shuffleImage,
      clickAction: () => playerService.isConnected() ?
        playerService.send("shuffle")
        : dispatch(shuffle()),
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
          onClick={percentage => {
            const time = percentage * player.totalSeconds;
            playerService.isConnected() ?
              playerService.send(`seek ${time}`)
              : dispatch(seekTo(time))
          }}
        ></PlayerProgressBar>
        <span className="time total-time">{totalTime}</span>
        <VolumeBar
          onChange={(e) => {
            dispatch(updateVolume({ volume: e }))
          }}
          onChangeDelta={(e) => {
            dispatch(updateVolumeDelta({ delta: e }))
          }}/>
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

      <PlayerSocket />

      <Audio
        playing={player.playing}
        seekTime={player.seekToSeconds}
        url={player.url}
        volume={player.volume}
        muted={player.muted}
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
          console.log("Can play through", Date.now())
          dispatch(updateBuffer({ buffer: player.totalSeconds }))
          if (player.initialSync) return
          dispatch(setSynced(true))
          playerService.isConnected() && playerService.send("sync")
        }}
        onLoadedData={() => {
          playerService.isConnected() && playerService.send("loaded")
        }}
        onEnded={() => {
          console.log("Ended current audio.")
          playerService.isConnected() ?
            playerService.send("end")
            : dispatch(nextTrack())
        }}
      />
    </div>
  )
}

export default Player
