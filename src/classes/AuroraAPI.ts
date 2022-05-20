import { ResponseData } from "../types/Response"
import { AuthResponseData } from "../types/response/AuthResponse"
import { ProfileResponseData } from "../types/response/ProfileResponse"
import { ServersResponseData } from "../types/response/ServersResponse"
import { UpdatesResponseData } from "../types/response/UpdatesResponse"
import { APIError } from "./APIError"
import { AuroraAPISocket, ResponseError } from ".."

export class AuroraAPI {
    apiInstance: AuroraAPISocket

    constructor(url: string) {
        this.apiInstance = new AuroraAPISocket(url)
    }

    public async auth(login: string, password: string) {
        return <AuthResponseData>await this.getRequest("auth", { login, password })
    }

    public async getServers() {
        return <ServersResponseData>await this.getRequest("servers")
    }

    public async getProfile(uuid: string) {
        return <ProfileResponseData>await this.getRequest("profile", { uuid })
    }

    public async getUpdates(dir: string) {
        return <UpdatesResponseData>await this.getRequest("updates", { dir })
    }

    private async getRequest<T extends ResponseData>(method: string, payload?: any): Promise<T> {
        try {
            const { data } = await this.apiInstance.send(method, payload)
            return <T>data
        } catch (error) {
            const { code, message } = <ResponseError>error
            throw new APIError(code, message)
        }
    }
}
