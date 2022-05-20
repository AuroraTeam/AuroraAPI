import { Response, ResponseData } from "../Response"

export interface HashedFile {
    path: string
    hashsum: string
    size: number
}

export interface UpdatesResponseData extends ResponseData {
    hashes: HashedFile[]
}

export interface UpdatesResponse extends Response {
    data: UpdatesResponseData
}
