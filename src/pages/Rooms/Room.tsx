import type React from "react"
import type { RoomInfo } from "../../objects/roomInfo"
import "./Room.scss"

interface RoomProps {
  room: RoomInfo
}

const Room: React.FC<RoomProps> = ({ room }) => {
  return (
    <div className={"room"}>
      <span className="room-name">{room.name}</span>
    </div>
  )
}

export default Room