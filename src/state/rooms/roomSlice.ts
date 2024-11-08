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
    }
  }
})

export const { updateRooms, setRoom } = roomSlice.actions
export default roomSlice.reducer