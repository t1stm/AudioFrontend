import "./Player.scss"
import { useEffect, useState } from "react"

const Player = () => {
  let image = "http://localhost/Album_Covers/0c886945a45ec5da61f5073dbdf834d5aa8a8a33.jpg";
  let current_time = "00:00:00";
  let total_time = "00:01:00";
  let title = "Title - Artist";

  let buffered_style = {
    width: "50%"
  };

  let current_style = {
    width: "10%"
  };

  return (
    <div id="player">
      <div className="player-image-box">
        <img className="player-image" src={image} alt="Playing Thumbnail"></img>
      </div>
      <span className="title">{title}</span>

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