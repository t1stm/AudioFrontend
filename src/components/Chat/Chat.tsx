import type React from "react"
import "./Chat.scss"
import { useAppSelector } from "../../state/hooks"
import type { RootState } from "../../state/store"
import ChatMessage from "./ChatMessage"

const Chat: React.FC = () => {
  const { messages } = useAppSelector((state: RootState) => {
    return {
      messages: state.chat.messages
    }
  })

  return (
    <div className="chat">
      <span>Chat</span>
      <div className="chat-inner">
        {messages.map((message) => (
          <ChatMessage sender={message.sender} message={message.text} />
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Message..." />
        <button>Send</button>
      </div>
    </div>
  )
}

export default Chat;