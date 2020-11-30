/// <reference types="ws" />
import * as WebSocket from "isomorphic-ws";
import { Response, ResponseError } from "../types/Response";
import { WebSocketErrorEvent, WebSocketMessageEvent } from "../types/WebSocket";
import AuroraWebSocket from "./AuroraWebSocket";
import MessageEmitter from "./MessageEmitter";
export default class AuroraAPI {
    messageEmitter: MessageEmitter;
    socket?: AuroraWebSocket;
    constructor();
    connect(url: string, callback?: (error: null | WebSocketErrorEvent, api?: AuroraAPI) => void): void | Promise<AuroraAPI | WebSocketErrorEvent>;
    close(code?: number, data?: string): void;
    hasConnected(): boolean;
    send(type: string, data?: object, callback?: (error: null | ResponseError, data?: Response) => void): void | Promise<Response | ResponseError>;
    onOpen(): void;
    onClose(event: WebSocket.CloseEvent): void;
    onMessage(this: AuroraWebSocket, event: WebSocketMessageEvent): void;
    onError(event: WebSocketErrorEvent): void;
}
