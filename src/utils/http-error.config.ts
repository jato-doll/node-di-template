import {
    BAD_REQUEST,
    INTERNAL_SERVER,
    NOT_FOUND,
    StatusMessage,
    UNAUTHORIZED,
    UNPROCESSABLE_ENTITY,
} from "./http-code.config";

/**
 * HttpError class for throwing each type or error
 */
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    /**
     * The server could not understand the request due to invalid syntax
     */
    static BadRequest(
        message: StatusMessage | string = StatusMessage.BAD_REQUEST,
    ) {
        return new HttpError(message, BAD_REQUEST);
    }

    /**
     * The client must authenticate itself to get the requested response
     */
    static Unauthorized(
        message: StatusMessage | string = StatusMessage.UNAUTHORIZED,
    ) {
        return new HttpError(message, UNAUTHORIZED);
    }

    /**
     * The server can not find the requested resource
     */
    static NotFound(message: StatusMessage | string = StatusMessage.NOT_FOUND) {
        return new HttpError(message, NOT_FOUND);
    }

    /**
     * The server can not find the requested resource
     */
    static UnprocessableEnttity(
        message: StatusMessage | string = StatusMessage.UNPROCESSABLE_ENTITY,
    ) {
        return new HttpError(message, UNPROCESSABLE_ENTITY);
    }

    /**
     * The server has encountered a situation it doesn't know how to handle
     */
    static InternalServer(
        message: StatusMessage | string = StatusMessage.INTERNAL_SERVER,
    ) {
        return new HttpError(message, INTERNAL_SERVER);
    }
}
