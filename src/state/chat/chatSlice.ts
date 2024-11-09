import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"
import type { ChatMessage } from "../../objects/chatMessage"

interface ChatState {
  messages: ChatMessage[]
}

const initialState: ChatState = {
  messages: [],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    }
  },
})

export const { addChatMessage } = chatSlice.actions
export default chatSlice.reducer