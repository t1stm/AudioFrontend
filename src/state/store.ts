import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./player/playerSlice";
import queueReducer from "./queue/queueSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    queue: queueReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
