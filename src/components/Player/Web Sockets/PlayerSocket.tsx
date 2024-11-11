import type React from "react";
import { useEffect, useCallback} from "react"
import { useAppDispatch, useAppSelector } from "../../../state/hooks"
import type { RootState } from "../../../state/store"
import playerService from "../../../state/websockets/playerService"
import type { Command, RoomCommand, WebSocketCommand } from "./PlayerSocketUtils"
import { parseCommand } from "./PlayerSocketUtils"
import { seekTo, setPlaying, stop } from "../../../state/player/playerSlice"
import { setCurrentIndex, setQueue } from "../../../state/queue/queueSlice"
import { updateRoomInfo } from "../../../state/rooms/roomSlice"
import { addChatMessage } from "../../../state/chat/chatSlice"
import type { SearchObject } from "../../../state/search/searchObject"
import { toQueueObject } from "../../../pages/Search/SearchViewUtils"

const PlayerSocket: React.FC = () => {
  const { currentRoom, bitrate, codec } = useAppSelector((state: RootState) => {
    return {
      currentRoom: state.rooms.currentRoom,
      bitrate: state.settings.bitrate,
      codec: state.settings.currentCodec.name,
    }
  });

  const dispatch = useAppDispatch();

  const updateRoom = useCallback((room: WebSocketCommand) => {
    switch (room.command as RoomCommand) {
      case "name":
        dispatch(updateRoomInfo({
          name: room.params,
          description: null
        }))
        break;
      case "description":
        dispatch(updateRoomInfo({
          name: null,
          description: room.params
        }))
        break;
    }
  }, [dispatch])

  const addChat = useCallback((params: string) => {
    const index = params.indexOf("%%");
    const sender = params.substring(0, index).trim();
    const text = params.substring(index + 2).trim()

    dispatch(addChatMessage({
      sender,
      text
    }))
  }, [dispatch])

  const playerConnection = useCallback((message: string) => {
    const parsed = parseCommand(message)
    const params = parsed.params?.trim() ?? ""

    console.log("Received message: ", message, Date.now())

    switch (parsed.command as Command) {
      case "playing":
        switch (params) {
          case "True":
            dispatch(setPlaying(true))
            break;

          case "False":
            dispatch(setPlaying(false))
            break;
        }
        break
      case "stop":
        dispatch(stop())
        break
      case "seek":
      case "sync":
        dispatch(seekTo(JSON.parse(params) as number))
        break
      case "room":
        updateRoom(parseCommand(params))
        break
      case "chat":
        addChat(params)
        break
      case "queue":
        dispatch(setQueue((JSON.parse(params) as SearchObject[]).map(search_object =>
          toQueueObject(search_object, bitrate, codec))))
        break
      case "current":
        dispatch(setCurrentIndex(JSON.parse(params) as number))
        break
    }
  }, [dispatch, updateRoom, addChat, bitrate, codec])

  useEffect(() => {
    if (currentRoom == null) {
      playerService.disconnect()
      return
    }

    playerService.connect(currentRoom.roomID, playerConnection)
  }, [currentRoom, playerConnection])
  
  return <></>
}

export default PlayerSocket