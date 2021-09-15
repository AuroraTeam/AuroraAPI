import * as WebSocket from "isomorphic-ws"
import { v4 as uuidv4 } from "uuid"

import { Request } from "../types/Request"
import { Response, ResponseError } from "../types/Response"
import MessageEmitter from "./MessageEmitter"

export default class AuroraAPI {
    _messageEmitter: MessageEmitter = new MessageEmitter()
    _socket: WebSocket
    _ready = () => {}
    // можно расмотреть использование приватныйх полей через #
    // https://github.com/tc39/proposal-class-fields/blob/master/PRIVATE_SYNTAX_FAQ.md

    constructor(url: string) {
        this._socket = new WebSocket(url)
        this._socket.onclose = (event) => this.onClose(event)
        this._socket.onerror = (event) => this.onError(event)
        this._socket.onmessage = (event) => this.onMessage(event)
        this._socket.onopen = (event) => {
            this.onOpen(event)
            this._ready()
        }
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
     */
    public send(type: string, data?: object): Promise<Response | ResponseError>

    public send(
        type: string,
        data: object = {},
        callback?: (error: null | ResponseError, data?: Response) => void
    ): void | Promise<Response | ResponseError> {
        if (!this._socket) return console.error("WebSocket not connected")

        const obj: Request = {
            type: type,
            uuid: uuidv4(),
            data: data,
        }

        this._socket.send(JSON.stringify(obj))
        if (callback !== undefined) {
            // Callback style
            this._messageEmitter.addListener(obj.uuid, (data: Response | ResponseError): void => {
                if ((data as ResponseError).code !== undefined) callback(data as ResponseError)
                else callback(null, data as Response)
            })
        } else {
            // Promise style
            return new Promise((resolve, reject) => {
                this._messageEmitter.addListener(obj.uuid, (data: Response | ResponseError): void => {
                    if ((data as ResponseError).code !== undefined) reject(data as ResponseError)
                    else resolve(data as Response)
                })
            })
        }
    }

    /* Events */
    public onOpen(_event: WebSocket.OpenEvent | Event): void {
        console.log("Connection established")
    }

    public onClose(event: WebSocket.CloseEvent | CloseEvent) {
        if (event.wasClean) return console.log("Connection closed")
        if (event.code === 1006) console.error("Break connection")
        else {
            console.error("Unknown error")
            console.dir(event)
        }
    }

    public onMessage(event: WebSocket.MessageEvent | MessageEvent) {
        this._messageEmitter.emit(JSON.parse(event.data as string))
    }

    public onError(event: WebSocket.ErrorEvent | Event) {
        console.error("WebSocket error observed:", event)
    }
}
