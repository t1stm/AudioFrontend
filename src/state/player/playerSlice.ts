import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { QueueObject } from "../../objects/queueObject"

export interface PlayerState {
  current: QueueObject

  currentIndex: number
  playing: boolean | null
  currentSeconds: number
  bufferedSeconds: number
  seekToSeconds: number | null
  volume: number
  muted: boolean
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
  currentIndex: -1,
  playing: true,
  currentSeconds: 0,
  bufferedSeconds: 0,
  seekToSeconds: null,
  volume: 1,
  muted: false
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
      state.volume = Math.min(Math.max(action.payload.volume, 0), 1)
      state.muted = false
    },
    updateVolumeDelta: (state, action: PayloadAction<{delta: number}>) => {
      state.volume += action.payload.delta
      state.volume = Math.min(Math.max(state.volume, 0), 1)
    },
    setCurrent: (
      state,
      action: PayloadAction<{ object: QueueObject; index: number }>,
    ) => {
      state.current = action.payload.object
      state.currentIndex = action.payload.index
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
    seekOffset: (state, action: PayloadAction<number>) => {
      state.seekToSeconds = state.currentSeconds + action.payload
    },
    stop: state => {
      state.playing = false
      state.currentSeconds = 0
    },
    toggleMute: state => {
      state.muted = !state.muted;
    }
  },
})

export const {
  updateTime,
  updateBuffer,
  updateVolume,
  updateVolumeDelta,
  setPlaying,
  setCurrent,
  stop,
  seekTo,
  seekOffset,
  toggleMute
} = playerSlice.actions
export default playerSlice.reducer
