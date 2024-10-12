import { createSlice } from "@reduxjs/toolkit"

interface QueueEntry {

}

interface QueueState {
  entries: QueueEntry[];
}

export const queueSlice = createSlice({
  name: "queue",
  initialState: {
    entries: [],
  },
  reducers: {}
})

export default queueSlice.reducer;