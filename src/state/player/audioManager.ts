export enum SocketState {
  Opened,
  Closed
}


export default class AudioManager {
  private socket: WebSocket | undefined
  private socketState: SocketState = SocketState.Closed;

  async connect(url: string) {
    const socket = this.socket = new WebSocket(url)
    socket.onopen = () => {
      this.socketState = SocketState.Opened;
    }

    socket.addEventListener("message", (event) => this.handleEvent(event))

    socket.onclose = () => {
      this.socketState = SocketState.Closed;
    }
  }

  handleEvent(event: MessageEvent<any>) {

  }

  isOpen(): boolean {
    return this.socketState === SocketState.Opened
  }

  async send(message: string) {
    this.socket?.send(message);
  }

  close() {
    this.socket?.close();
  }
}