import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { QueueObject } from "../../objects/queueObject"
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
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload
    },
    addToQueue: (state, action: PayloadAction<QueueObject>) => {
      state.objects.push(action.payload)
    },
    shuffle: state => {
      state.objects = shuffleArray(state.objects, state.currentIndex ?? 0)
    },
    previousTrack: state => {
      if (state.objects.length < 1) return
      if (state.currentIndex < 1) return

      state.currentIndex -= 1
    },
    nextTrack: state => {
      if (state.objects.length < 1) return
      if (state.currentIndex + 1 >= state.objects.length) return

      state.currentIndex += 1
    },
    setNext: (state, action: PayloadAction<number>) => {
      const objects = state.objects
      const targetIndex = action.payload

      if (
        targetIndex === state.currentIndex ||
        targetIndex >= objects.length ||
        targetIndex < 0
      )
        return

      if (state.currentIndex > targetIndex) state.currentIndex--

      const removed = objects.splice(targetIndex, 1)
      objects.splice(state.currentIndex + 1, 0, removed[0]) // [0] is asserted above by only getting one
      state.objects = objects
    },
  },
})

export const {
  setNext,
  setCurrentIndex,
  addToQueue,
  shuffle,
  previousTrack,
  nextTrack,
} = queueSlice.actions
export default queueSlice.reducer
