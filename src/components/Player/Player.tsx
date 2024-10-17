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
        <div className="stop-button" onClick={() => dispatch(stopAsync())}></div>
        <div className="previous-button" onClick={() => dispatch(previousTrackAsync())}></div>
        <div className="play-pause-button" onClick={() => dispatch(playPauseAsync())}></div>
        <div className="next-button" onClick={() => dispatch(nextTrackAsync())}></div>
        <div className="shuffle-button" onClick={() => dispatch(shuffleAsync())}></div>
      </div>

      <Audio playing={playing} seekTime={seekToSeconds} url={url}
             onTimeUpdate={(event) => {
               const player = event.currentTarget;
               const time = player.currentTime;
               dispatch(updateTime({ time: time }));
             }}

             onBuffer={(event) => {
               const player = event.currentTarget;
               const buffer = player.buffered;
               if (buffer.length < 1) return;

               const end = buffer.end(buffer.length - 1);
               console.log("Buffer End: ", end);
               dispatch(updateBuffer({ buffer: end }));
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
  onBuffer: (event: SyntheticEvent<HTMLAudioElement>) => void
}

const Audio: React.FC<AudioParams> = (
  {
    url,
    playing,
    seekTime,
    onTimeUpdate,
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
           onProgress={onBuffer}>
    </audio>
  )
}

export default Player;