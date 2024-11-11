import type React from "react"
import { useState } from "react"
import "./Chat.scss"
import { useAppSelector } from "../../state/hooks"
import type { RootState } from "../../state/store"
import ChatMessage from "./ChatMessage"
import playerService from "../../state/websockets/playerService"

interface ChatProps {
  standalone: boolean
}

const Chat: React.FC<ChatProps> = ({ standalone }: ChatProps) => {
  const { messages } = useAppSelector((state: RootState) => {
    return {
      messages: state.chat.messages,
    }
  })

  const [chatMessage, setChatMessage] = useState("")
  return (
    <div className={(standalone ? "chat-standalone " : "") + "chat"}>
      <span>Chat</span>
      <div className="chat-inner">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            sender={message.sender}
            message={message.text}
          />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Message..."
          onChange={e => setChatMessage(e.target.value)}
          onKeyUp={e => {
            if (e.key !== "Enter" || chatMessage.trim() === "") return
            playerService.send(`chat ${chatMessage}`)
            e.currentTarget.value = ""
          }}
        />
        <button onClick={() => playerService.send(`chat ${chatMessage}`)}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
