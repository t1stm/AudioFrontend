import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { SearchObject } from "./searchObject"

const searchEndpoint = "http://localhost:5226/Audio/Search";

interface SearchState {
  objects: SearchObject[];
}

const initialState: SearchState = {
  objects: [],
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(searchAsync.fulfilled,
      (state, action) => {
      if (action.payload == null) return;
      state.objects = action.payload;
    })
  }
})

export const searchAsync = createAsyncThunk(
  "search/searchAsync",
  async (term: string): Promise<SearchObject[] | null> => {
    if (term.length < 1) return [];

    const encoded = encodeURI(term);
    const response = await fetch(`${searchEndpoint}?query=${encoded}`);
    const objects = await response.json();
    if (objects['status'] === 404) return [];

    return objects as SearchObject[];
  },
)

export default searchSlice.reducer