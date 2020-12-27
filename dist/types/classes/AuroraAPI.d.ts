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
    /**
     * Подключение к API (Callback style)
     * @param url Адрес API
     * @param callback Функция обратного вызова (обработка подключения)
     */
    connect(url: string, callback: (error: null | WebSocketErrorEvent, api?: AuroraAPI) => void): void;
    /**
     * Подключение к API (Promise style)
     * @param url Адрес API
     */
    connect(url: string): Promise<AuroraAPI | WebSocketErrorEvent>;
    close(code?: number, data?: string): void;
    hasConnected(): boolean;
    /**
     * Отправка запроса (Callback style)
     * @param type Тип реквеста
     * @param data Данные
     * @param callback Функция обратного вызова (обработка ответа)
     */
    send(type: string, data: object | undefined, callback: (error: null | ResponseError, data?: Response) => void): void;
    /**
     * Отправка запроса (Promise style)
     * @param type Тип реквеста
     * @param data Данные
     */
    send(type: string, data?: object): Promise<Response | ResponseError>;
    onOpen(): void;
    onClose(event: WebSocket.CloseEvent): void;
    onMessage(this: AuroraWebSocket, event: WebSocketMessageEvent): void;
    onError(event: WebSocketErrorEvent): void;
}
