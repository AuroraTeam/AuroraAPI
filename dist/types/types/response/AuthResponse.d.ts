import { Response, ResponseData } from "../Response";
export interface AuthResponseData extends ResponseData {
    username: string;
    userUUID: string;
    accessToken: string;
}
export interface AuthResponse extends Response {
    data: AuthResponseData;
}
