import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface SettingsState {
}

const initialState: SettingsState = {
}

const settingsSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
})

export default settingsSlice.reducer
