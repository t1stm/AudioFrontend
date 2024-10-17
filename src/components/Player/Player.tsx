import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { AppDispatch, RootState } from "../../state/store"
import { nextTrackAsync, playPauseAsync, previousTrackAsync, stopAsync } from "../../state/player/playerSlice"
import { PlayerProgressBar } from "../Progress Bar/PlayerProgressBar"

function getTimeString(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11,19);
}

const Player = () => {
  const { title, artist, currentSeconds, bufferedSeconds, totalSeconds, image } = useAppSelector((state: RootState) => {
    return {
      title: state.player.title,
      artist: state.player.artist,
      currentSeconds: state.player.currentSeconds,
      bufferedSeconds: state.player.bufferedSeconds,
      totalSeconds: state.player.totalSeconds,
      image: state.player.image
    }
  });
  const dispatch = useAppDispatch<AppDispatch>();

  const current_time = getTimeString(currentSeconds);
  const total_time = getTimeString(totalSeconds);

  return (
    <div id="player">
      <div className="player-image-box">
        <img className="player-image" src={image} alt="Playing Thumbnail"></img>
      </div>
      <span className="title">{title}</span>
      <span className="artist">{artist}</span>

      <span className="player-progress">
        <span className="time current-time">{current_time}</span>
        <PlayerProgressBar currentSeconds={currentSeconds}
                           bufferedSeconds={bufferedSeconds}
                           totalSeconds={totalSeconds}>
        </PlayerProgressBar>
        <span className="time total-time">{total_time}</span>
      </span>

      <div className="player-buttons">
        <div className="stop-button" onClick={() => dispatch(stopAsync())}></div>
        <div className="previous-button" onClick={() => dispatch(previousTrackAsync())}></div>
        <div className="play-pause-button" onClick={() => dispatch(playPauseAsync())}></div>
        <div className="next-button" onClick={() => dispatch(nextTrackAsync())}></div>
        <div className="shuffle-button"></div>
      </div>
    </div>
  );
}

export default Player;