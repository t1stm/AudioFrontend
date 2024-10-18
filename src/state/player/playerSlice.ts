import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AudioManager from "./audioManager"
import type { QueueObject } from "./queueObject"

const audioManager = new AudioManager()

interface Queue {
  objects: QueueObject[]
}

interface PlayerThunk {
  isWebSocket: boolean
}

interface PlayerState {
  queue: Queue
  current: QueueObject
  currentIndex: number | null

  playing: boolean
  currentSeconds: number
  bufferedSeconds: number
  seekToSeconds: number
}

const defaultCurrent: QueueObject = {
  title: "Title",
  artist: "Artist",
  totalSeconds: 60,
  image: "/static/0c886945a45ec5da61f5073dbdf834d5aa8a8a33.jpg",
  url: "",
}

const initialState: PlayerState = {
  current: {
    ...defaultCurrent,
  },
  currentIndex: null,
  playing: false,
  currentSeconds: 10,
  bufferedSeconds: 30,
  seekToSeconds: 0,
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
    updateBuffer: (state, action: PayloadAction<{buffer: number}>) => {
      state.bufferedSeconds = action.payload.buffer
    }
  },
  extraReducers: builder => {
    builder.addCase(shuffleAsync.fulfilled, (state, action) => {
      // handle if shuffle is handled by a server
      if (!action.payload.isWebSocket) return;

      // gets the current queue objects and the current id
      const queueObjects = state.queue.objects;
      const currentIndex = state.currentIndex ?? 0;

      // do nothing if there are no objects in the queue
      if (queueObjects.length < 1) return;

      // removes the current playing object, to put it in later as the first
      const current = queueObjects.slice(currentIndex, currentIndex + 1);
      queueObjects.splice(currentIndex, 1);

      // shuffle algorithm using Math.random
      for (let i = queueObjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queueObjects[i], queueObjects[j]] = [queueObjects[j], queueObjects[i]];
      }

      // gets the first object that is confirmed to exist due to a check above
      const firstElement = current[0];
      queueObjects.splice(0, 0, firstElement); // current[0] is implicitly one item as specified above when getting it.

      // set the state to work with the shuffled queue
      state.currentIndex = 0;
      state.queue.objects = queueObjects;
      state.current = firstElement;

    }).addCase(previousTrackAsync.fulfilled, (state, action) => {
      if (action.payload.isWebSocket) return;
      if (state.queue.objects.length < 1) return;

      if (state.currentIndex == null) {
        state.current = state.queue.objects[0];
        state.currentIndex = 0;
        return;
      }

      if (state.currentIndex - 1 < 0) {
        state.seekToSeconds = 0;
        return;
      }

      state.current = state.queue.objects[--state.currentIndex];
      state.currentSeconds = 0;
      state.bufferedSeconds = 0;
      state.playing = true;

    }).addCase(nextTrackAsync.fulfilled, (state, action) => {
      if (action.payload.isWebSocket) return;
      if (state.queue.objects.length < 1) return;

      if (state.currentIndex == null) {
        state.current = state.queue.objects[0];
        state.currentIndex = 0;
        return;
      }

      if (state.currentIndex + 1 >= state.queue.objects.length) {
        state.seekToSeconds = state.current.totalSeconds;
        return;
      }

      state.current = state.queue.objects[++state.currentIndex];
      state.seekToSeconds = 0;
      state.playing = true;

    }).addCase(playPauseAsync.fulfilled, (state, action) => {
      if (action.payload.isWebSocket) return;
      state.playing = !state.playing;

    }).addCase(stopAsync.fulfilled, (state, action) => {
      if (action.payload.isWebSocket) return;

      state.playing = false;
      state.seekToSeconds = 0;
      state.currentIndex = null;

    }).addCase(addToQueueAsync.fulfilled, (state, action: PayloadAction<QueueObject | null>) => {
      if (!action.payload) return;
      state.queue.objects.push(action.payload);
    })
  },
})

export const addToQueueAsync = createAsyncThunk(
  "player/addToQueueAsync",
  async (object: QueueObject): Promise<QueueObject | null> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return null;
    }

    return object;
  },
)

export const previousTrackAsync = createAsyncThunk(
  "player/previousTrackAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        isWebSocket: true
      };
    }

    return {
      isWebSocket: false
    };
  },
)

export const nextTrackAsync = createAsyncThunk(
  "player/nextTrackAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        isWebSocket: true
      };
    }

    return {
      isWebSocket: false
    };
  },
)

export const playPauseAsync = createAsyncThunk(
  "player/playPauseAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        isWebSocket: true
      };
    }

    return {
      isWebSocket: false
    };
  },
)

export const stopAsync = createAsyncThunk(
  "player/stopAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        isWebSocket: true
      };
    }

    return {
      isWebSocket: false
    };
  }
)

export const shuffleAsync = createAsyncThunk(
  "player/shuffleAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        isWebSocket: true
      };
    }

    return {
      isWebSocket: false
    };
  },
)

export const { updateTime, updateBuffer } = playerSlice.actions
export default playerSlice.reducer