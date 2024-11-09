import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import playerReducer from "./player/playerSlice"
import searchReducer from "./search/searchSlice"
import queueReducer from "./queue/queueSlice"
import settingsReducer from "./settings/settingsSlice"
import roomReducer from "./rooms/roomSlice"
import chatReducer from "./chat/chatSlice"

const rootReducer = combineReducers({
  player: playerReducer,
  search: searchReducer,
  queue: queueReducer,
  rooms: roomReducer,
  settings: settingsReducer,
  chat: chatReducer
})

export type RootState = ReturnType<typeof rootReducer>
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware()
    },
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
