import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import AudioManager from "./audioManager"

const audioManager = new AudioManager();

interface PlayerSlice {
  title: string;
  artist: string;
  file: string;
  image: string;
  currentSeconds: number;
  bufferedSeconds: number;
  totalSeconds: number;
}

const initialState: PlayerSlice = {
  title: "Title",
  artist: "Artist",
  file: "",
  image: "/static/0c886945a45ec5da61f5073dbdf834d5aa8a8a33.jpg",
  currentSeconds: 10,
  bufferedSeconds: 30,
  totalSeconds: 60,
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    loadTrack: (state, action: PayloadAction<{file: string}>) => {
      state.file = action.payload.file;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(previousTrackAsync.fulfilled, (state, action) => {
      //
    });
  }
});

export const previousTrackAsync = createAsyncThunk(
  "player/previousTrackAsync",
  async () => {
    if (audioManager.isOpen()) {
      //
    }
  }
)

export const nextTrackAsync = createAsyncThunk(
  "player/nextTrackAsync",
  async () => {
    if (audioManager.isOpen()) {
      //
    }

  }
)

export const playPauseAsync = createAsyncThunk(
  "player/playPauseAsync",
  async () => {
    if (audioManager.isOpen()) {
      //
    }

  }
)

export const stopAsync = createAsyncThunk(
  "player/stopAsync",
  async () => {
    audioManager.close()
  }
)

export const { loadTrack } = playerSlice.actions;
export default playerSlice.reducer;