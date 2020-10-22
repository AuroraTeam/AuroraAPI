export interface Response {
    uuid: string
    data: object
}

export interface ResponseError {
    uuid: string
    code: number
    message: string
}

export type ResponseEvent = (data: Response | ResponseError) => void