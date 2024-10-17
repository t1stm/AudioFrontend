import "./Player.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { AppDispatch, RootState } from "../../state/store"

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

  let buffered_style = {
    width: `${100 * bufferedSeconds / totalSeconds}%`
  };

  let current_style = {
    width: `${100 * currentSeconds / totalSeconds}%`
  };

  return (
    <div id="player">
      <div className="player-image-box">
        <img className="player-image" src={image} alt="Playing Thumbnail"></img>
      </div>
      <span className="title">{title}</span>
      <span className="artist">{artist}</span>

      <span className="player-progress">
        <span className="time current-time">{current_time}</span>
        <div className="progress-bar">
          <div className="progress-bar-buffered" style={buffered_style}></div>
          <div className="progress-bar-current" style={current_style}></div>
        </div>
        <span className="time total-time">{total_time}</span>
      </span>

      <div className="player-buttons">
        <div className="stop-button"></div>
        <div className="previous-button"></div>
        <div className="play-pause-button"></div>
        <div className="next-button"></div>
        <div className="shuffle-button"></div>
      </div>
    </div>
  );
}

export default Player;