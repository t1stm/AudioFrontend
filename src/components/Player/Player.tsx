import type { AppDispatch, RootState } from "../../state/store"
import type React from "react"
import type { SyntheticEvent } from "react";

import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import {
  nextTrackAsync,
  playPauseAsync,
  previousTrackAsync,
  shuffleAsync,
  stopAsync, updateBuffer, updateTime
} from "../../state/player/playerSlice"
import { PlayerProgressBar } from "./Progress Bar/PlayerProgressBar"
import { useEffect, useRef } from "react"

function getTimeString(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11,19);
}

const Player = () => {
  const { title, artist, currentSeconds, bufferedSeconds, totalSeconds, image, playing, url, seekToSeconds } = useAppSelector((state: RootState) => {
    return {
      title: state.player.current.title,
      artist: state.player.current.artist,
      totalSeconds: state.player.current.totalSeconds,
      image: state.player.current.image,
      url: state.player.current.url,

      currentSeconds: state.player.currentSeconds,
      bufferedSeconds: state.player.bufferedSeconds,
      playing: state.player.playing,
      seekToSeconds: state.player.seekToSeconds
    }
  });
  const dispatch = useAppDispatch<AppDispatch>();

  const currentTime = getTimeString(currentSeconds);
  const totalTime = getTimeString(totalSeconds);

  return (
    <div id="player">
      <div className="player-image-box">
        <img className="player-image" src={image} alt="Playing Thumbnail"></img>
      </div>
      <span className="title">{title}</span>
      <span className="artist">{artist}</span>

      <span className="player-progress">
        <span className="time current-time">{currentTime}</span>
        <PlayerProgressBar currentSeconds={currentSeconds}
                           bufferedSeconds={bufferedSeconds}
                           totalSeconds={totalSeconds}>
        </PlayerProgressBar>
        <span className="time total-time">{totalTime}</span>
      </span>

      <div className="player-buttons">
        <img src="/static/icons/stop.png" className="stop-button" alt="Stop button"
             onClick={() => dispatch(stopAsync())}></img>
        <img src="/static/icons/back.png" className="previous-button" alt="Previous button"
             onClick={() => dispatch(previousTrackAsync())}></img>
        <img src={playing ? "/static/icons/play.png" : "/static/icons/pause.png"}
             className="play-pause-button" alt={playing ? "Play button" : "Pause button"}
             onClick={() => dispatch(playPauseAsync())}></img>
        <img src="/static/icons/next.png" className="next-button" alt="Next button"
             onClick={() => dispatch(nextTrackAsync())}></img>
        <img src="/static/icons/shuffle.png" className="shuffle-button" alt="Shuffle button"
             onClick={() => dispatch(shuffleAsync())}></img>
      </div>

      <Audio playing={playing} seekTime={seekToSeconds} url={url}
             onTimeUpdate={(event) => {
               const player = event.currentTarget
               const time = player.currentTime
               dispatch(updateTime({ time: time }))
             }}

             onBuffer={(event) => {
               const player = event.currentTarget
               const buffer = player.buffered
               if (buffer.length < 1) return;

               const end = buffer.end(buffer.length - 1);
               dispatch(updateBuffer({ buffer: end }));
             }}

             onLoadedData={(event) => {
               const player = event.currentTarget;
               dispatch(updateBuffer({ buffer: player.duration }));
             }}
      />
    </div>
  );
}

interface AudioParams {
  url: string
  playing: boolean
  seekTime: number
  onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>) => void
  onLoadedData: (event: SyntheticEvent<HTMLAudioElement>) => void,
  onBuffer: (event: SyntheticEvent<HTMLAudioElement>) => void
}

const Audio: React.FC<AudioParams> = (
  {
    url,
    playing,
    seekTime,
    onTimeUpdate,
    onLoadedData,
    onBuffer
  }) => {
  const ref = useRef<null | HTMLAudioElement>(null);
  playing ? ref.current?.play().then() : ref.current?.pause();

  useEffect(() => {
    if (ref.current != null)
      ref.current.currentTime = seekTime
  }, [seekTime])

  return (
    <audio ref={ref}
           src={url}
           onTimeUpdate={onTimeUpdate}
           onProgress={onBuffer}
           onCanPlayThrough={onLoadedData}>
    </audio>
  )
}

export default Player;