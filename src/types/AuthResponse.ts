import { Response } from "aurorarpc-client"

export interface AuthResponseData {
    username: string
    userUUID: string
    accessToken: string
}

export interface AuthResponse extends Response {
    result: AuthResponseData
}
