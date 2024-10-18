import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AudioManager from "./audioManager"
import type { QueueObject } from "./queueObject"

const audioManager = new AudioManager()

interface Queue {
  objects: QueueObject[]
}

interface PlayerThunk {
  executeDisconnected: boolean
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
    builder.addCase(shuffleAsync.fulfilled, (state, action: PayloadAction<PlayerThunk>) => {
      if (!action.payload.executeDisconnected) return;

      const queueObjects = state.queue.objects;
      const currentIndex = state.currentIndex ?? 0;

      const current = queueObjects.slice(currentIndex, currentIndex + 1);
      queueObjects.splice(currentIndex, 1);

      // shuffle algorithm
      for (let i = queueObjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queueObjects[i], queueObjects[j]] = [queueObjects[j], queueObjects[i]];
      }

      const firstElement = current[0];
      queueObjects.splice(0, 0, firstElement); // current[0] is implicitly one item as specified above when getting it.

      state.currentIndex = 0;
      state.queue.objects = queueObjects;
      state.current = firstElement;
    }).addCase(previousTrackAsync.fulfilled, (state, action: PayloadAction<PlayerThunk>) => {
      if (!action.payload.executeDisconnected) return;
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
      if (!action.payload.executeDisconnected) return;
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
      if (!action.payload.executeDisconnected) return;
      state.playing = !state.playing;
    }).addCase(stopAsync.fulfilled, (state, action) => {
      if (!action.payload.executeDisconnected) return;

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
        executeDisconnected: false
      };
    }

    return {
      executeDisconnected: true
    };
  },
)

export const nextTrackAsync = createAsyncThunk(
  "player/nextTrackAsync",
  async () => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        executeDisconnected: false
      };
    }

    return {
      executeDisconnected: true
    };
  },
)

export const playPauseAsync = createAsyncThunk(
  "player/playPauseAsync",
  async () => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        executeDisconnected: false
      };
    }

    return {
      executeDisconnected: true
    };
  },
)

export const stopAsync = createAsyncThunk(
  "player/stopAsync",
  async () => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        executeDisconnected: false
      };
    }

    return {
      executeDisconnected: true
    };
  }
)

export const shuffleAsync = createAsyncThunk(
  "player/shuffleAsync",
  async (): Promise<PlayerThunk> => {
    if (audioManager.isOpen()) {
      await audioManager.send("");
      return {
        executeDisconnected: false
      };
    }

    return {
      executeDisconnected: true
    };
  },
)

export const { updateTime, updateBuffer } = playerSlice.actions
export default playerSlice.reducer