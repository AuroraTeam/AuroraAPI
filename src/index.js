const WebSocket = require('isomorphic-ws');
const genRandUUIDv4 = require('./Utils/genRandUUIDv4')

module.exports = class AuroraAPI {
    constructor() {
        this.requestMap = new Map();
        this.genRandUUIDv4 = genRandUUIDv4;
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
            this.socket.AuroraAPI = this;
        });
    }

    close() {
        this.socket.close();
    }

    hasConnected() {
        if (!this.socket) return false;
        return this.socket.readyState === this.socket.OPEN;
    }

    sendRequest(type, data, callback, errorCallback) {
        if (!this.checkValidRequestType(type)) return console.error('Не валидный type');
        data.type = type;
        data.requestUUID = this.genRandUUIDv4();
        this.requestMap.set(data.requestUUID, event => {
            if (event.type === "error") {
                if (errorCallback !== undefined) errorCallback(event);
            } else callback(event);
        });
        this.socket.send(JSON.stringify(data));
    }

    checkValidRequestType(type) {
        if (type === undefined || type === '') return false;
        return true;
    }

    /* Events */
    onOpen() {
        console.log('Соединение установлено');
    }

    onClose(event) {
        if (event.wasClean) return console.log('Соединение закрыто');
        if (event.code === 1006) console.error('Разрыв соединения');
        else {
            console.error('Неизвестная ошибка');
            console.dir(event);
        }
    }

    onMessage(event) {
        const obj = JSON.parse(event.data);
        const requestMap = this.AuroraAPI.requestMap;
        if (obj.requestUUID && requestMap.has(obj.requestUUID)) {
            requestMap.get(obj.requestUUID)(obj);
            requestMap.delete(obj.requestUUID);
        } else {
            if (obj.type === "error") console.error(obj.error);
            else console.dir(obj);
        }
    }

    onError() {
        console.error('Ошибка при подключеннии!');
    }
}