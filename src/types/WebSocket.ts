import * as WebSocket from 'isomorphic-ws'
import { AuroraAPI } from '../classes/AuroraAPI'

export type AuroraWebSocket = WebSocket & { api?: AuroraAPI }
export type WebSocketErrorEvent = WebSocket.ErrorEvent| Event
export type WebSocketMessageEvent = WebSocket.MessageEvent | MessageEvent
