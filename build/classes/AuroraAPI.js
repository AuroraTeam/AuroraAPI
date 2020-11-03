"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const AuroraWebSocket_1 = require("./AuroraWebSocket");
const MessageEmitter_1 = require("./MessageEmitter");
class AuroraAPI {
    constructor() {
        this.messageEmitter = new MessageEmitter_1.default();
    }
    connect(url, callback) {
        this.socket = new AuroraWebSocket_1.default(url, this);
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        if (callback !== undefined) {
            // Callback style
            this.socket.onopen = () => {
                this.onOpen();
                callback(null, this);
            };
            this.socket.onerror = (error) => {
                this.onError(error);
                callback(error);
            };
        }
        else {
            // Promise style
            return new Promise((resolve, reject) => {
                ;
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
        if (this.socket)
            this.socket.close(code, data);
    }
    hasConnected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === this.socket.OPEN;
    }
    send(type, data, callback) {
        if (!this.socket)
            return console.error("WebSocket not connected");
        const obj = {
            type: type,
            uuid: uuid_1.v4(),
            data: data,
        };
        this.socket.send(JSON.stringify(obj));
        if (callback !== undefined) {
            // Callback style
            this.messageEmitter.addListener(obj.uuid, (data) => {
                if (data.code !== undefined)
                    callback(data);
                else
                    callback(null, data);
            });
        }
        else {
            // Promise style
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
        console.log("Connection established");
    }
    onClose(event) {
        if (event.wasClean)
            return console.log("Connection closed");
        if (event.code === 1006)
            console.error("Break connection");
        else {
            console.error("Unknown error");
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
exports.default = AuroraAPI;
//# sourceMappingURL=AuroraAPI.js.map