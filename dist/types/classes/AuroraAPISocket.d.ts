/// <reference types="ws" />
import WebSocket from "modern-isomorphic-ws";
import { Response } from "../types/Response";
export declare class AuroraAPISocket {
    private _messageEmitter;
    private _socket;
    private _ready;
    constructor(url: string, events?: {
        onClose?: (event: WebSocket.CloseEvent | CloseEvent) => void;
        onError?: (event: WebSocket.ErrorEvent | Event) => void;
        onMessage?: (event: WebSocket.MessageEvent | MessageEvent) => void;
        onOpen?: (event: WebSocket.Event | Event) => void;
    });
    close(code?: number, data?: string): void;
    hasConnected(): boolean;
    ready(): Promise<unknown>;
    /**
     * Отправка запроса
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
