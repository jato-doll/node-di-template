/**
 * **200 OK:** Standard response for successful HTTP requests
 */
export const OK = 200;
/**
 * **201 Created:** The request has been fulfilled, resulting
 * in the creation of a new resource
 */
export const CREATED = 201;
/**
 * **No Content:** The server has successfully fulfilled the request
 * and there is no additional content to send
 */
export const NO_CONTENT = 204;
/**
 * **400 Bad Request:** The server could not understand the request
 * due to invalid syntax
 */
export const BAD_REQUEST = 400;
/**
 * **401 Unauthorized:** The client must authenticate itself to get
 * the requested response
 */
export const UNAUTHORIZED = 401;
/**
 * **404 Not Found:** The server can not find the requested resource
 */
export const NOT_FOUND = 404;
/**
 * **422 Unprocessable Entity:** The server understands the request
 * but cannot process it due to semantic errors or validation issues
 */
export const UNPROCESSABLE_ENTITY = 422;
/**
 * **500 Internal Server:** The server has encountered a situation
 * it doesn't know how to handle
 */
export const INTERNAL_SERVER = 500;

/**
 * Status Messages Enum
 */
export enum StatusMessage {
    OK = "Success",
    CREATED = "Created",
    NO_CONTENT = "No Content",
    BAD_REQUEST = "Bad Request",
    UNAUTHORIZED = "Unauthorized",
    NOT_FOUND = "Not Found",
    UNPROCESSABLE_ENTITY = "Unprocessable Entity",
    INTERNAL_SERVER = "Internal Server",
}
