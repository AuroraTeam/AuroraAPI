import { AuthResponseData } from "../types/response/AuthResponse";
import { ProfileResponseData } from "../types/response/ProfileResponse";
import { ServersResponseData } from "../types/response/ServersResponse";
import { UpdatesResponseData } from "../types/response/UpdatesResponse";
import { AuroraAPISocket } from "..";
export declare class AuroraAPI {
    apiInstance: AuroraAPISocket;
    constructor(url: string);
    auth(login: string, password: string): Promise<AuthResponseData>;
    getServers(): Promise<ServersResponseData>;
    getProfile(uuid: string): Promise<ProfileResponseData>;
    getUpdates(dir: string): Promise<UpdatesResponseData>;
    private getRequest;
}
