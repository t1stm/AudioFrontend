import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"
import type { CodecInfo} from "../../objects/codecs";
import { Opus } from "../../objects/codecs"

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
    setCodec: (state, action: PayloadAction<CodecInfo>) => {
      state.currentCodec = action.payload
    },
    setBitrate: (state, action: PayloadAction<number>) => {
      state.bitrate = action.payload
    },
    setSupportedCodecs: (state, action: PayloadAction<CodecInfo[]>) => {
      state.supportedCodecs = action.payload
    }
  },
})

export const { setCodec, setBitrate, setSupportedCodecs } = settingsSlice.actions
export default settingsSlice.reducer
