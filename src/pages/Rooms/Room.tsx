import type React from "react";
import { useCallback } from "react"
import type { RoomInfo } from "../../objects/roomInfo"
import "./Room.scss"
import { useAppDispatch } from "../../state/hooks"
import { setRoom } from "../../state/rooms/roomSlice"

interface RoomProps {
  room: RoomInfo
  isCurrent: boolean
}

const Room: React.FC<RoomProps> = ({ room, isCurrent }) => {
  const dispatch = useAppDispatch()

  const join = useCallback(() => {
    dispatch(setRoom(room))
  }, [room, dispatch])

  return (
    <div className="room">
      <div className="room-info">
        <span className="room-prefix">
          Name:
          <span>{room.name}</span>
        </span>
        <span className="room-prefix">
          Description:
          <span>{room.description}</span>
        </span>
      </div>
      <button className="room-join-button" disabled={isCurrent} onClick={join}>{isCurrent ? "Connected" : "Join"}</button>
    </div>
  )
}

export default Room