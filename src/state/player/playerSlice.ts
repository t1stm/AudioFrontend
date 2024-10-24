import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { QueueObject } from "./queue"

export interface PlayerState {
  current: QueueObject

  playing: boolean | null
  currentSeconds: number
  bufferedSeconds: number
  seekToSeconds: number | null
  volume: number
}

const defaultCurrent: QueueObject = {
  title: "Empty",
  artist: "Start Playing Something",
  totalSeconds: 0,
  image: "",
  url: "",
  platform: {
    prettyName: "None",
    color: "",
    identifier: "",
  },
}

const initialState: PlayerState = {
  current: {
    ...defaultCurrent,
  },
  playing: true,
  currentSeconds: 0,
  bufferedSeconds: 0,
  seekToSeconds: null,
  volume: 0.5,
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<{ time: number }>) => {
      state.currentSeconds = action.payload.time
    },
    updateBuffer: (state, action: PayloadAction<{ buffer: number }>) => {
      if (action.payload.buffer > state.bufferedSeconds)
        state.bufferedSeconds = action.payload.buffer
    },
    updateVolume: (state, action: PayloadAction<{ volume: number }>) => {
      state.volume = action.payload.volume
    },
    setCurrent: (state, action: PayloadAction<QueueObject>) => {
      state.current = action.payload
      state.currentSeconds = 0
      state.bufferedSeconds = 0
      state.seekToSeconds = null
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload
    },
    seekTo: (state, action: PayloadAction<number>) => {
      state.seekToSeconds = action.payload
    },
    stop: state => {
      state.playing = false
      state.currentSeconds = 0
    },
  },
})

export const {
  updateTime,
  updateBuffer,
  updateVolume,
  setPlaying,
  setCurrent,
  stop,
  seekTo
} = playerSlice.actions
export default playerSlice.reducer
