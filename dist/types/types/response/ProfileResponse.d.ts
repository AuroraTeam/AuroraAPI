import { Response, ResponseData } from "../Response";
export interface Profile {
    configVersion: number;
    uuid: string;
    sortIndex: number;
    version: string;
    clientDir: string;
    assetsIndex: string;
    assetsDir: string;
    update: string[];
    updateVerify: string[];
    updateExclusions: string[];
    mainClass: string;
    classPath: string[];
    jvmArgs: string[];
    clientArgs: string[];
}
export interface ProfileResponseData extends ResponseData {
    profile: Profile;
}
export interface ProfileResponse extends Response {
    data: ProfileResponseData;
}
