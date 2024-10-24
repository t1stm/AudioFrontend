import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { QueueObject } from "../player/queue"
import { shuffleArray } from "./queueUtils"


interface QueueState {
  objects: QueueObject[]
  currentIndex: number
}

const initialState: QueueState = {
  objects: [],
  currentIndex: 0,
}

const queueSlice = createSlice({
  name: "queue",
  initialState: initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<{ index: number }>) => {
      state.currentIndex = action.payload.index
    },
    addToQueue: (state, action: PayloadAction<QueueObject>) => {
      state.objects.push(action.payload)
    },
    shuffle: (state) => {
      state.objects = shuffleArray(state.objects, state.currentIndex ?? 0)
    },
    previousTrack: (state) => {
      if (state.objects.length < 1) return
      if (state.currentIndex < 1) return

      state.currentIndex -= 1
    },
    nextTrack: (state) => {
      if (state.objects.length < 1) return
      if (state.currentIndex + 1 >= state.objects.length) return

      state.currentIndex += 1
    }
  }
})

export const { setCurrentIndex, addToQueue, shuffle, previousTrack, nextTrack } = queueSlice.actions
export default queueSlice.reducer