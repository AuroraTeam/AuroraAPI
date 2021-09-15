/// <reference types="ws" />
import * as WebSocket from "isomorphic-ws";
import { Response, ResponseError } from "../types/Response";
import MessageEmitter from "./MessageEmitter";
export default class AuroraAPI {
    _messageEmitter: MessageEmitter;
    _socket: WebSocket;
    _ready: () => void;
    constructor(url: string);
    close(code?: number, data?: string): void;
    hasConnected(): boolean;
    ready(): Promise<unknown>;
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
    onOpen(_event: WebSocket.OpenEvent | Event): void;
    onClose(event: WebSocket.CloseEvent | CloseEvent): void;
    onMessage(event: WebSocket.MessageEvent | MessageEvent): void;
    onError(event: WebSocket.ErrorEvent | Event): void;
}
