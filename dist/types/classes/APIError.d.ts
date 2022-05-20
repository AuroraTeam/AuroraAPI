export declare class APIError extends Error {
    private code;
    constructor(code?: number, message?: string);
    toObject(): {
        code: number;
        message: string;
    };
    toJson(): string;
}
