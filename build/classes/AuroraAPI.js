"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraAPI = void 0;
const WebSocket = require("isomorphic-ws");
const uuid_1 = require("uuid");
class AuroraAPI {
    constructor() {
        this.requestsMap = new Map();
    }
    connect(url) {
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
    close() {
        this.socket.close();
    }
    hasConnected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === this.socket.OPEN;
    }
    sendRequest(type, data, callback, errorCallback) {
        data.type = type;
        data.uuid = uuid_1.v4();
        this.requestsMap.set(data.uuid, (data) => {
            if (data.code !== undefined) {
                if (errorCallback !== undefined)
                    errorCallback(data);
            }
            else
                callback(data);
        });
        this.socket.send(JSON.stringify(data));
    }
    /* Events */
    onOpen() {
        console.log('Соединение установлено');
    }
    onClose(event) {
        if (event.wasClean)
            return console.log('Соединение закрыто');
        if (event.code === 1006)
            console.error('Разрыв соединения');
        else {
            console.error('Неизвестная ошибка');
            console.dir(event);
        }
    }
    onMessage(event) {
        const data = JSON.parse(event.data);
        const requestsMap = this.api.requestsMap;
        if (data.uuid !== undefined && requestsMap.has(data.uuid)) {
            requestsMap.get(data.uuid)(data);
            requestsMap.delete(data.uuid);
        }
        else {
            if (data.code !== undefined)
                console.error(data);
            else
                console.dir(data);
        }
    }
    onError() {
        console.error('Ошибка при подключеннии!');
    }
}
exports.AuroraAPI = AuroraAPI;
//# sourceMappingURL=AuroraAPI.js.map