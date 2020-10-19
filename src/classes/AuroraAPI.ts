import * as WebSocket from 'isomorphic-ws'
import { v4 as uuidv4 } from 'uuid'
import { Request } from '../types/Request';
import { Response } from '../types/Response';
import { ResponseError } from '../types/ResponseError';
import { ResponseEvent } from '../types/ResponseEvent';

export class AuroraAPI {
    requestsMap: Map<string, ResponseEvent> = new Map();
    socket: WebSocket & { api?: AuroraAPI }

    connect(url: string): Promise<AuroraAPI | WebSocket.ErrorEvent> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(url);
            this.socket.onopen = () => {
                this.onOpen();
                resolve(this);
            };
            this.socket.onerror = (err) => {
                this.onError();
                reject(err);
            };
            this.socket.onclose = this.onClose;
            this.socket.onmessage = this.onMessage;
            this.socket.api = this;
        });
    }

    close(): void {
        this.socket.close();
    }

    hasConnected(): boolean {
        if (!this.socket) return false;
        return this.socket.readyState === this.socket.OPEN;
    }

    sendRequest(type: string, data: Request, callback: (data: Response) => void, errorCallback: (data: ResponseError) => void) {
        data.type = type;
        data.uuid = uuidv4();

        this.requestsMap.set(data.uuid, (data: Response | ResponseError): void => {
            if ((data as ResponseError).code !== undefined) {
                if (errorCallback !== undefined) errorCallback(data as ResponseError);
            } else callback(data as Response);
        });
        this.socket.send(JSON.stringify(data));
    }

    /* Events */
    onOpen(): void {
        console.log('Соединение установлено');
    }

    onClose(event: WebSocket.CloseEvent) {
        if (event.wasClean) return console.log('Соединение закрыто');
        if (event.code === 1006) console.error('Разрыв соединения');
        else {
            console.error('Неизвестная ошибка');
            console.dir(event);
        }
    }

    onMessage(this: WebSocket & { api?: AuroraAPI }, event: WebSocket.MessageEvent) {
        const data: Response | ResponseError = JSON.parse(event.data as string);
        const requestsMap = this.api.requestsMap;
        if (data.uuid !== undefined && requestsMap.has(data.uuid)) {
            requestsMap.get(data.uuid)(data);
            requestsMap.delete(data.uuid);
        } else {
            if ((data as ResponseError).code !== undefined) console.error(data);
            else console.dir(data);
        }
    }

    onError() {
        console.error('Ошибка при подключеннии!');
    }
}