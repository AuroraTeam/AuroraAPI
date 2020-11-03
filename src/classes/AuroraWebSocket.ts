import * as url from 'url'
import * as WebSocket from 'isomorphic-ws'
import AuroraAPI from './AuroraAPI'

export default class AuroraWebSocket extends WebSocket {
    api: AuroraAPI

    constructor(address: string | url.URL, api: AuroraAPI) {
        super(address)
        this.api = api
    }
}
