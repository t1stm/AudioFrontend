import "./Player.scss"
import { useState } from "react"

const Player = () => {
  let image: string = "";

  return (
    <div id="player">
      <img src={image} alt="Playing Thumbnail"></img>
    </div>
  );
}

export default Player;