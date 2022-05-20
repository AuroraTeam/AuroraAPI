export interface Response {
    uuid: string;
    data: ResponseData;
}
export interface ResponseError {
    uuid: string;
    code: number;
    message: string;
}
export declare type ResponseEvent = (data: Response | ResponseError) => void;
export declare type ResponseData = object;
