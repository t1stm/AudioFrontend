import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Codec, CodecInfo, Opus } from "../../objects/codecs"

export interface SettingsState {
  currentCodec: CodecInfo,
  supportedCodecs: CodecInfo[],
  bitrate: number,
}

const initialState: SettingsState = {
  currentCodec: Opus,
  supportedCodecs: [],
  bitrate: 112
}

const settingsSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCodec: (state, action: PayloadAction<Codec>) => {
      state.currentCodec = action.payload
    },
    setBitrate: (state, action: PayloadAction<number>) => {
      state.bitrate = action.payload
    },
    setSupportedCodecs: (state, action: PayloadAction<Codec[]>) => {
      state.supportedCodecs = action.payload
    }
  },
})

export const { setCodec, setBitrate, setSupportedCodecs } = settingsSlice.actions
export default settingsSlice.reducer
