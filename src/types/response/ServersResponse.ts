import { Response, ResponseData } from "../Response"

export interface Server {
    ip: string
    port: number
    title: string
    profileUUID: string
}

export interface ServersResponseData extends ResponseData {
    servers: Server[]
}

export interface ServersResponse extends Response {
    data: ServersResponseData
}
