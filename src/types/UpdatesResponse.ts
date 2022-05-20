import { Response } from "aurorarpc-client"

export interface HashedFile {
    path: string
    hashsum: string
    size: number
}

export interface UpdatesResponseData {
    hashes: HashedFile[]
}

export interface UpdatesResponse extends Response {
    result: UpdatesResponseData
}
