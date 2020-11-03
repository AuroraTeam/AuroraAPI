"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraAPI = void 0;
const WebSocket = require("isomorphic-ws");
const uuid_1 = require("uuid");
const MessageEmitter_1 = require("./MessageEmitter");
class AuroraAPI {
    constructor() {
        this.messageEmitter = new MessageEmitter_1.MessageEmitter();
        this.socket = null;
    }
    connect(url, callback) {
        this.socket = new WebSocket(url);
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.api = this;
        if (callback !== undefined) { // Callback style
            this.socket.onopen = () => {
                this.onOpen();
                callback(null, this);
            };
            this.socket.onerror = (error) => {
                this.onError(error);
                callback(error);
            };
        }
        else { // Promise style
            return new Promise((resolve, reject) => {
                this.socket.onopen = () => {
                    this.onOpen();
                    resolve(this);
                };
                this.socket.onerror = (err) => {
                    this.onError(err);
                    reject(err);
                };
            });
        }
    }
    close(code, data) {
        this.socket.close(code, data);
    }
    hasConnected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === this.socket.OPEN;
    }
    send(type, data, callback) {
        const obj = {
            type: type,
            uuid: uuid_1.v4(),
            data: data
        };
        this.socket.send(JSON.stringify(obj));
        if (callback !== undefined) { // Callback style
            this.messageEmitter.addListener(obj.uuid, (data) => {
                if (data.code !== undefined)
                    callback(data);
                else
                    callback(null, data);
            });
        }
        else { // Promise style
            return new Promise((resolve, reject) => {
                this.messageEmitter.addListener(obj.uuid, (data) => {
                    if (data.code !== undefined)
                        reject(data);
                    else
                        resolve(data);
                });
            });
        }
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
        this.api.messageEmitter.emit(JSON.parse(event.data));
    }
    onError(event) {
        console.error("WebSocket error observed:", event);
    }
}
exports.AuroraAPI = AuroraAPI;
//# sourceMappingURL=AuroraAPI.js.map