import type React from "react";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../state/hooks"
import type { RootState } from "../../../state/store"
import playerService from "../../../state/websockets/playerService"
import { addChatMessage } from "../../../state/chat/chatSlice"

const PlayerSocket: React.FC = () => {
  const { currentRoom } = useAppSelector((state: RootState) => {
    return {
      currentRoom: state.rooms.currentRoom
    }
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentRoom == null)
      playerService.disconnect()
    else playerService.connect(currentRoom.roomID, (message) => {
      dispatch(addChatMessage({
        sender: "System", // TODO, change this to parse different commands from the backend
        text: message
      }))
    })
  }, [currentRoom, dispatch])
  
  return <></>
}

export default PlayerSocket