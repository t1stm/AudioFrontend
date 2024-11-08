import { BACKEND_MULTIPLAYER_WEBSOCKET } from "../../config"

export class RoomsService {
  socket: WebSocket | null = null;
  connect(onMessage: (message: string) => void) {
    this.disconnect();
    this.socket = new WebSocket(`${BACKEND_MULTIPLAYER_WEBSOCKET}/Rooms`)
    this.socket.onmessage = (e) => {
      onMessage(e.data as string)
    }
  }
  disconnect() {
    this.socket?.close()
    this.socket = null
  }
}


const roomsService = new RoomsService();
export default roomsService;