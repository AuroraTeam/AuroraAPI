import { Response, ResponseError, ResponseEvent } from "../types/Response";
export default class MessageEmitter {
    listeners: Map<string, ResponseEvent>;
    addListener(uuid: string, listener: ResponseEvent): void;
    emit(data: Response | ResponseError): void;
}
