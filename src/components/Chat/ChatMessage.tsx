import type React from "react"
import "./ChatMessage.scss"

interface ChatMessageProps {
  sender: string
  message: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message }) => {
  return (
    <div className="chat-message">
      <span className="chat-sender">[{sender}]: </span>
      <span className="chat-text">{message}</span>
    </div>
  )
}

export default ChatMessage