import { ResponseError } from "./ResponseError";
import { Response } from "./Response";

export type ResponseEvent = (data: Response | ResponseError) => void