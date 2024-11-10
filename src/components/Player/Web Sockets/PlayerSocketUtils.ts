export type Command = | "playing" | "stop" | "seek" | "chat" | "queue" | "current" | "sync" | "room";
export type RoomCommand = | "name" | "description";

export interface WebSocketCommand {
  command: Command | RoomCommand
  params: string | null
}

export function parseCommand(message: string): WebSocketCommand {
  const space = message.indexOf(' ')
  if (space === -1) {
    return {
      command: message as Command,
      params: null
    }
  }

  const command = message.substring(0, space)
  const params = message.substring(space + 1)

  return {
    command: command as Command,
    params: params
  }
}