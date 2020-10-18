const WebSocket = require('isomorphic-ws');
const getRandUUIDv4 = require('./Utils/getRandUUIDv4')

module.exports = class AuroraAPI {
    constructor() {
        this.requestMap = new Map();
        this.getRandUUIDv4 = getRandUUIDv4;
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
        data.uuid = this.getRandUUIDv4();
        this.requestMap.set(data.uuid, event => {
            if (event.code !== undefined) {
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
        if (obj.uuid && requestMap.has(obj.uuid)) {
            requestMap.get(obj.uuid)(obj);
            requestMap.delete(obj.uuid);
        } else {
            if (event.code !== undefined) console.error(obj.error);
            else console.dir(obj);
        }
    }

    onError() {
        console.error('Ошибка при подключеннии!');
    }
}