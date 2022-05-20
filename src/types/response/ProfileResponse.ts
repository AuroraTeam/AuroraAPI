import { Response, ResponseData } from "../Response"

export interface Profile {
    //Don`t touch
    configVersion: number

    // Profile information
    uuid: string
    sortIndex: number
    // servers: ProfileServerConfig[]

    // Client
    version: string
    clientDir: string

    // Assets
    assetsIndex: string
    assetsDir: string

    // Updates
    update: string[]
    updateVerify: string[]
    updateExclusions: string[]
    // updateOptional: ProfileOptional[]

    // Launch client
    mainClass: string
    classPath: string[]
    jvmArgs: string[]
    clientArgs: string[]
}

export interface ProfileResponseData extends ResponseData {
    profile: Profile
}

export interface ProfileResponse extends Response {
    data: ProfileResponseData
}
