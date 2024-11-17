import type React from "react";
import type { RoomInfo } from "../../objects/roomInfo"
import type { RootState } from "../../state/store"
import { useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import { setRoom, updateRooms } from "../../state/rooms/roomSlice"
import { BACKEND_MULTIPLAYER_HTTPS } from "../../config"
import Room from "./Room"
import "./Rooms.scss"
import roomsService from "../../state/websockets/roomsService"

const Rooms: React.FC = () => {
  const { rooms, current } = useAppSelector((state: RootState) => {
    return {
      rooms: state.rooms.rooms,
      current: state.rooms.currentRoom
    }
  });

  const dispatch = useAppDispatch()

  useEffect(() => {
    roomsService.connect((message) => {
      dispatch(updateRooms(JSON.parse(message) as RoomInfo[]))
    })

    return () => roomsService.disconnect()
  }, [dispatch])

  const createCallback = useCallback(() => {
    fetch(`${BACKEND_MULTIPLAYER_HTTPS}/CreateRoom`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((roomData) => {
        const room = roomData as RoomInfo;
        dispatch(setRoom(room))
      })
  }, [dispatch])

  return (
    <div className="rooms-section">
      <div className="rooms-bar">
        <input
          type="text"
          className="rooms-search"
          placeholder="Search rooms..."
        />
        <button onClick={createCallback}>Create Room</button>
      </div>
      <div className="rooms-list">
        {rooms.map(r => (
          <Room
            key={r.roomID}
            room={r}
            isCurrent={r.roomID === current?.roomID}
          />
        ))}
      </div>
    </div>
  )
}

export default Rooms;