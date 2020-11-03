import * as WebSocket from "isomorphic-ws"

export type WebSocketErrorEvent = WebSocket.ErrorEvent | Event
export type WebSocketMessageEvent = WebSocket.MessageEvent | MessageEvent
