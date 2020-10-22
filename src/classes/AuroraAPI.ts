import * as WebSocket from 'isomorphic-ws'
import { v4 as uuidv4 } from 'uuid'
import { Request } from '../types/Request'
import { Response, ResponseError } from '../types/Response'
import { AuroraWebSocket, WebSocketErrorEvent, WebSocketMessageEvent } from '../types/WebSocket'
import { MessageEmitter } from './MessageEmitter'

export class AuroraAPI {
    messageEmitter: MessageEmitter = new MessageEmitter()
    socket: AuroraWebSocket

    connect(url: string, callback?: (error: null | WebSocketErrorEvent, api?: AuroraAPI) => void): void | Promise<AuroraAPI | WebSocketErrorEvent> {
        this.socket = new WebSocket(url)
        this.socket.onclose = this.onClose
        this.socket.onmessage = this.onMessage
        this.socket.api = this

        if (callback !== undefined) { // Callback style
            this.socket.onopen = () => {
                this.onOpen()
                callback(null, this)
            }
            this.socket.onerror = (error) => {
                this.onError(error)
                callback(error)
            }
        } else { // Promise style
            return new Promise((resolve, reject) => {
                this.socket.onopen = () => {
                    this.onOpen()
                    resolve(this)
                }
                this.socket.onerror = (err) => {
                    this.onError(err)
                    reject(err)
                }
            })
        }
    }

    close(code?: number, data?: string): void {
        this.socket.close(code, data)
    }

    hasConnected(): boolean {
        if (!this.socket) return false
        return this.socket.readyState === this.socket.OPEN
    }

    send(type: string, data: Request, callback?: (error: null | ResponseError, data?: Response) => void): void | Promise<Response | ResponseError> {
        data.type = type
        data.uuid = uuidv4()

        this.socket.send(JSON.stringify(data))
        if (callback !== undefined) { // Callback style
            this.messageEmitter.addListener(data.uuid, (data: Response | ResponseError): void => {
                if ((data as ResponseError).code !== undefined) callback(data as ResponseError)
                else callback(null, data as Response)
            })
        } else { // Promise style
            return new Promise((resolve, reject) => {
                this.messageEmitter.addListener(data.uuid, (data: Response | ResponseError): void => {
                    if ((data as ResponseError).code !== undefined) reject(data as ResponseError)
                    else resolve(data as Response)
                })
            })
        }
    }

    /* Events */
    onOpen(): void {
        console.log('Соединение установлено')
    }

    onClose(event: WebSocket.CloseEvent) {
        if (event.wasClean) return console.log('Соединение закрыто')
        if (event.code === 1006) console.error('Разрыв соединения')
        else {
            console.error('Неизвестная ошибка')
            console.dir(event)
        }
    }

    onMessage(this: AuroraWebSocket, event: WebSocketMessageEvent) {
        this.api.messageEmitter.emit(JSON.parse(event.data as string))
    }

    onError(event: WebSocketErrorEvent) {
        console.error("WebSocket error observed:", event);
    }
}