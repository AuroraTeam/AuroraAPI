/// <reference types="ws" />
import * as WebSocket from "isomorphic-ws";
import { Response, ResponseError } from "../types/Response";
export default class AuroraAPI {
    private _messageEmitter;
    private _socket;
    private _ready;
    constructor(url: string, events?: {
        onClose?: (event: WebSocket.CloseEvent | CloseEvent) => void;
        onError?: (event: WebSocket.ErrorEvent | Event) => void;
        onMessage?: (event: WebSocket.MessageEvent | MessageEvent) => void;
        onOpen?: (event: WebSocket.OpenEvent | Event) => void;
    });
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
     * @throws {ResponseError}
     */
    send(type: string, data?: object): Promise<Response>;
    private onOpen;
    private onClose;
    private onMessage;
    private onError;
}
