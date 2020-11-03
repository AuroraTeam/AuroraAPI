"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageEmitter {
    constructor() {
        this.listeners = new Map();
    }
    addListener(uuid, listener) {
        this.listeners.set(uuid, listener);
    }
    emit(data) {
        if (data.uuid !== undefined && this.listeners.has(data.uuid)) {
            ;
            this.listeners.get(data.uuid)(data);
            this.listeners.delete(data.uuid);
        }
        else {
            if (data.code !== undefined)
                console.error(data);
            else
                console.dir(data);
        }
    }
}
exports.default = MessageEmitter;
//# sourceMappingURL=MessageEmitter.js.map