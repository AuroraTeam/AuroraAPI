import * as WebSocket from "isomorphic-ws"
import { v4 as uuidv4 } from "uuid"

import { Response, ResponseError } from "../types/Response"
import MessageEmitter from "./MessageEmitter"

// Можно рассмотреть использование приватных полей через #
// https://github.com/tc39/proposal-class-fields/blob/master/PRIVATE_SYNTAX_FAQ.md
// У вебпака есть свои приколы на этот счёт, мб заменить его к чёрту?))
// + logger settings

export default class AuroraAPI {
    private _messageEmitter = new MessageEmitter()
    private _socket: WebSocket
    private _ready = () => {
        console.error(
            "[AuroraAPI] If you see this message, tell the developer of the `aurora-api` library that he is the creator of the crutches."
        )
    }

    constructor(
        url: string,
        events?: {
            onClose?: (event: WebSocket.CloseEvent | CloseEvent) => void
            onError?: (event: WebSocket.ErrorEvent | Event) => void
            onMessage?: (event: WebSocket.MessageEvent | MessageEvent) => void
            onOpen?: (event: WebSocket.OpenEvent | Event) => void
        }
    ) {
        this._socket = new WebSocket(url)
        this._socket.onclose = (event) => this.onClose(event, events?.onClose)
        this._socket.onerror = (event) => this.onError(event, events?.onError)
        this._socket.onmessage = (event) => this.onMessage(event, events?.onMessage)
        this._socket.onopen = (event) => this.onOpen(event, events?.onOpen)
    }

    // reopen?
    public close(code?: number, data?: string): void {
        this._socket.close(code, data)
    }

    public hasConnected(): boolean {
        return this._socket.readyState === this._socket.OPEN
    }

    public async ready() {
        if (this.hasConnected()) return true
        return await new Promise((resolve) => {
            this._ready = () => {
                resolve(true)
            }
        })
    }

    /**
     * Отправка запроса (Callback style)
     * @param type Тип реквеста
     * @param data Данные
     * @param callback Функция обратного вызова (обработка ответа)
     */
    public send(
        type: string,
        data: object | undefined,
        callback: (error: null | ResponseError, data?: Response) => void
    ): void
    /**
     * Отправка запроса (Promise style)
     * @param type Тип реквеста
     * @param data Данные
     * @throws {ResponseError}
     */
    public send(type: string, data?: object): Promise<Response>

    public send(
        type: string,
        data: object = {},
        callback?: (error: null | ResponseError, data?: Response) => void
    ): void | Promise<Response> {
        if (!this.hasConnected()) return console.error("[AuroraAPI] WebSocket not connected")

        const uuid = uuidv4()
        this._socket.send(JSON.stringify({ type, uuid, data }))

        if (callback === undefined)
            // Promise style
            return new Promise((resolve, reject) => {
                this._messageEmitter.addListener(uuid, (data: Response | ResponseError): void => {
                    if ((<ResponseError>data).code !== undefined) reject(data)
                    else resolve(<Response>data)
                })
            })
        // Callback style
        this._messageEmitter.addListener(uuid, (data: Response | ResponseError): void => {
            if ((<ResponseError>data).code !== undefined) callback(<ResponseError>data)
            else callback(null, <Response>data)
        })
    }

    /* Events */

    private onOpen(
        event: WebSocket.OpenEvent | Event,
        eventListener?: (event: WebSocket.OpenEvent | Event) => void
    ): void {
        console.log("[AuroraAPI] Connection established")
        this._ready()
        if (eventListener) eventListener(event)
    }

    private onClose(
        event: WebSocket.CloseEvent | CloseEvent,
        eventListener?: (event: WebSocket.CloseEvent | CloseEvent) => void
    ) {
        if (event.wasClean) return console.log("[AuroraAPI] Connection closed")
        if (event.code === 1006) console.error("[AuroraAPI] Break connection")
        else console.error("[AuroraAPI] Unknown error", event)
        if (eventListener) eventListener(event)
    }

    private onMessage(
        event: WebSocket.MessageEvent | MessageEvent,
        eventListener?: (event: WebSocket.MessageEvent | MessageEvent) => void
    ) {
        this._messageEmitter.emit(JSON.parse(event.data))
        if (eventListener) eventListener(event)
    }

    private onError(
        event: WebSocket.ErrorEvent | Event,
        eventListener?: (event: WebSocket.ErrorEvent | Event) => void
    ) {
        console.error("[AuroraAPI] WebSocket error observed:", event)
        if (eventListener) eventListener(event)
    }
}
