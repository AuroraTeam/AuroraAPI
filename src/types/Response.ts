export interface Response {
    uuid: string
    data: ResponseData
}

export interface ResponseError {
    uuid: string
    code: number
    message: string
}

export type ResponseEvent = (data: Response | ResponseError) => void
export type ResponseData = object
