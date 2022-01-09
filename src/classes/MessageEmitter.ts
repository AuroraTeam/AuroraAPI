import { Response, ResponseError, ResponseEvent } from "../types/Response"

export default class MessageEmitter {
    listeners: Map<string, ResponseEvent> = new Map()

    public addListener(uuid: string, listener: ResponseEvent) {
        this.listeners.set(uuid, listener)
    }

    public emit(data: Response | ResponseError) {
        if (data.uuid === undefined) return console.error("[AuroraAPI] Broken request: ", data)
        if (!this.listeners.has(data.uuid)) return console.error("[AuroraAPI] Unhandled request: ", data)

        this.listeners.get(data.uuid)!(data)
        this.listeners.delete(data.uuid)
    }
}
