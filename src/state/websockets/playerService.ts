import { BACKEND_MULTIPLAYER_WEBSOCKET } from "../../config"

export class PlayerService {
  socket: WebSocket | null = null;
  currentRoomId: string | null = null;
  connect(roomId: string, onMessage: (message: string) => void) {
    if (this.currentRoomId === roomId) return
    this.currentRoomId = roomId

    this.disconnect()
    this.socket = new WebSocket(`${BACKEND_MULTIPLAYER_WEBSOCKET}/Join?room=${roomId}`)
    this.socket.onmessage = (e) => {
      onMessage(e.data as string)
    }
  }

  disconnect() {
    this.socket?.close()
    this.socket = null
  }

  send(message: string) {
    console.log("Sending message: ", message)
    this.socket?.send(message)
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN
  }
}


const playerService = new PlayerService();
export default playerService;