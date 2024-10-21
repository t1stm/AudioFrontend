import type { PlayerState } from "./playerSlice"
import type { Draft } from "@reduxjs/toolkit"
import type { PlayerThunk } from "./playerThunk"

export function failsQueueChecks(payload: PlayerThunk, state: Draft<PlayerState>): boolean {
  if (payload.isWebSocket || state.queue.objects.length < 1) return true

  if (state.currentIndex == null) {
    state.current = state.queue.objects[0]
    state.currentIndex = 0
    return true
  }

  return false
}