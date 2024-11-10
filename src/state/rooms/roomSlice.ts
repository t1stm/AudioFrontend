import type { PayloadAction } from "@reduxjs/toolkit";
import type { RoomInfo } from "../../objects/roomInfo"
import { createSlice } from "@reduxjs/toolkit"

export interface RoomState {
  currentRoom: RoomInfo | null,
  rooms: RoomInfo[]
}

const initialState: RoomState = {
  currentRoom: null,
  rooms: [],
}

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    updateRooms: (state, action: PayloadAction<RoomInfo[]>) => {
      state.rooms = action.payload
    },
    setRoom: (state, action: PayloadAction<RoomInfo>) => {
      state.currentRoom = action.payload
    },
    updateRoomInfo: (state, action: PayloadAction<{name: string | null, description: string | null}>) => {
      if (state.currentRoom == null) return

      state.currentRoom.name = action.payload.name ?? state.currentRoom.name
      state.currentRoom.description = action.payload.description ?? state.currentRoom.description
    }
  }
})

export const { updateRooms, setRoom, updateRoomInfo } = roomSlice.actions
export default roomSlice.reducer