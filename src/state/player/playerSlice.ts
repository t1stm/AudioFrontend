import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AudioManager from "./audioManager"
import type { PlayerThunk } from "./playerThunk"
import type { Queue, QueueObject } from "./queue"
import { failsGenericPlayerChecks } from "./playerUtils"

const audioManager = new AudioManager()

export interface PlayerState {
  queue: Queue
  current: QueueObject
  currentIndex: number | null

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
}

const initialState: PlayerState = {
  current: {
    ...defaultCurrent,
  },
  currentIndex: null,
  playing: false,
  currentSeconds: 0,
  bufferedSeconds: 0,
  seekToSeconds: null,
  volume: 0.5,
  queue: {
    objects: [],
  },
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
  },
  extraReducers: builder => {
    builder
      .addCase(
        addToQueueAsync.fulfilled,
        (state, action) => {
          if (!action.payload) return
          state.queue.objects.push(action.payload)

          if (state.currentIndex == null) {
            // ensured by the push above that there are at least one objects in the queue
            state.currentIndex = 0
            state.current = state.queue.objects[0]
            state.playing = true
            return
          }

          // handle when song is finished to play the next one added
          if (state.currentIndex + 2 === state.queue.objects.length && Math.abs(state.currentSeconds - state.current.totalSeconds) < 1) {
            state.current = state.queue.objects[++state.currentIndex]
            state.playing = true
          }
          return
        },
      )
      .addCase(shuffleAsync.fulfilled, (state, action) => {
        // handle if shuffle is handled by a server
        if (!action.payload.isWebSocket) return

        // gets the current queue objects and the current id
        const queueObjects = state.queue.objects
        const currentIndex = state.currentIndex ?? 0

        // do nothing if there are no objects in the queue
        if (queueObjects.length < 1) return

        // removes the current playing object, to put it in later as the first
        const current = queueObjects.slice(currentIndex, currentIndex + 1)
        queueObjects.splice(currentIndex, 1)

        // shuffle algorithm using Math.random
        for (let i = queueObjects.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [queueObjects[i], queueObjects[j]] = [queueObjects[j], queueObjects[i]]
        }

        // gets the first object that is confirmed to exist due to a check above
        const firstElement = current[0]
        queueObjects.splice(0, 0, firstElement) // current[0] is implicitly one item as specified above when getting it.

        // set the state to work with the shuffled queue
        state.currentIndex = 0
        state.queue.objects = queueObjects
        state.current = firstElement
      })
      .addCase(previousTrackAsync.fulfilled, (state, action) => {
        if (failsGenericPlayerChecks(action.payload, state)) return
        state.playing = null;

        if (state.currentIndex! - 1 < 0) {
          state.seekToSeconds = 0
          return
        }

        state.playing = true;
        state.current = state.queue.objects[--state.currentIndex!]
        state.currentSeconds = 0
        state.bufferedSeconds = 0
      })
      .addCase(nextTrackAsync.fulfilled, (state, action) => {
        if (failsGenericPlayerChecks(action.payload, state)) return
        state.playing = null;

        if (state.currentIndex == null) {
          state.current = state.queue.objects[0]
          state.currentIndex = 0
          return
        }

        if (state.currentIndex + 1 >= state.queue.objects.length) {
          state.seekToSeconds = state.current.totalSeconds
          return
        }

        state.playing = true
        state.current = state.queue.objects[++state.currentIndex]
        state.seekToSeconds = 0
        state.bufferedSeconds = 0
      })
      .addCase(playPauseAsync.fulfilled, (state, action) => {
        if (action.payload.isWebSocket) return
        if (action.payload.playing != null) {
          state.playing = action.payload.playing
          return
        }
        if (state.playing == null) {
          state.playing = false
          return
        }
        state.playing = !state.playing
      })
      .addCase(stopAsync.fulfilled, (state, action) => {
        if (action.payload.isWebSocket) return

        state.playing = false
        state.seekToSeconds = 0
        state.currentIndex = null
      })
      .addCase(
        endedAsync.fulfilled,
        (state, action) => {
          if (action.payload.isWebSocket || state.currentIndex == null) return
          state.playing = null

          if (state.currentIndex + 1 >= state.queue.objects.length) {
            return
          }

          state.current = state.queue.objects[++state.currentIndex]
          state.seekToSeconds = 0
          state.bufferedSeconds = 0
          state.playing = true
        }
      )
  },
})

export const addToQueueAsync = createAsyncThunk(
  "player/addToQueueAsync",
  async (object: QueueObject): Promise<QueueObject | null> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return null
    }

    return object
  },
)

export const previousTrackAsync = createAsyncThunk(
  "player/previousTrackAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
      }
    }

    return {
      isWebSocket: false,
    }
  },
)

export const nextTrackAsync = createAsyncThunk(
  "player/nextTrackAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
      }
    }

    return {
      isWebSocket: false,
    }
  },
)

export const playPauseAsync = createAsyncThunk(
  "player/playPauseAsync",
  async (playing: boolean | null): Promise<PlayerThunk & { playing: boolean | null }> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
        playing: null
      }
    }

    return {
      isWebSocket: false,
      playing: playing
    }
  },
)

export const stopAsync = createAsyncThunk(
  "player/stopAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
      }
    }

    return {
      isWebSocket: false,
    }
  },
)

export const shuffleAsync = createAsyncThunk(
  "player/shuffleAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
      }
    }

    return {
      isWebSocket: false,
    }
  },
)

export const endedAsync = createAsyncThunk(
  "player/endAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("")
      return {
        isWebSocket: true,
      }
    }

    return {
      isWebSocket: false,
    }
  }
)

export const { updateTime, updateBuffer } = playerSlice.actions
export default playerSlice.reducer