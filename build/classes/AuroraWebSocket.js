"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("isomorphic-ws");
class AuroraWebSocket extends WebSocket {
    constructor(address, api) {
        super(address);
        this.api = api;
    }
}
exports.default = AuroraWebSocket;
//# sourceMappingURL=AuroraWebSocket.js.map