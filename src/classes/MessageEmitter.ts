import { Response, ResponseError, ResponseEvent } from "../types/Response"

export class MessageEmitter {
    listeners: Map<string, ResponseEvent> = new Map()

    addListener(uuid: string, listener: ResponseEvent) {
        this.listeners.set(uuid, listener)
    }

    emit(data: Response | ResponseError) {
        if (data.uuid !== undefined && this.listeners.has(data.uuid)) {
            this.listeners.get(data.uuid)(data)
            this.listeners.delete(data.uuid)
        } else {
            if ((data as ResponseError).code !== undefined) console.error(data)
            else console.dir(data)
        }
    }
}