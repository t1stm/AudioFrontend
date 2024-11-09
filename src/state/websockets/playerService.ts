import { BACKEND_MULTIPLAYER_WEBSOCKET } from "../../config"

export class PlayerService {
  socket: WebSocket | null = null;
  connect(roomId: string, onMessage: (message: string) => void) {
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
}


const playerService = new PlayerService();
export default playerService;