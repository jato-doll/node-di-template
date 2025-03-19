import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Decorate } from "../../configs/constants.config";
import {
    BAD_REQUEST,
    CREATED,
    OK,
    StatusMessage,
} from "../http-code.config";

type HTTPVerb = "get" | "post" | "patch" | "delete";

export type ControllerRoute = {
    method: HTTPVerb;
    path: string;
    name: string;
};

// Decorator function for HTTP request
export function HTTPRequest(verb: HTTPVerb, path: string, code?: number) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        // Set route path
        const route: ControllerRoute = {
            method: verb,
            path: path,
            name: propertyKey,
        };

        Reflect.defineMetadata(
            Decorate.HTTP_ROUTE_PATH,
            route,
            target,
            propertyKey,
        );

        // Original method, descriptor.value
        const method = descriptor.value;

        // Apply transformations for request data transfer to object
        descriptor.value = async function (
            data: any, // "data" can be both req or dto when apply @ValidateRequest(ClassDTO)
            res: Response,
        ) {
            // When using return data
            if (code) {
                // get Class Transformer from metadata
                const classTransformRes = Reflect.getMetadata(
                    Decorate.CLASS_TRANSFORMER,
                    target,
                    propertyKey,
                );

                try {
                    let result = await method.apply(this, [data, res]);

                    // Transform http response from CLASS_TRANSFORM_RESPONSE
                    if (classTransformRes) {
                        result = plainToInstance(
                            classTransformRes,
                            result || {},
                            {
                                excludeExtraneousValues: true,
                            },
                        );
                    }

                    // Auto response data when return from controller's method
                    res.status(code).send({ code, data: result });
                } catch (error: any) {
                    const statusCode = error?.statusCode || 500;
                    const message =
                        error?.message || StatusMessage.INTERNAL_SERVER;

                    // Set error message to log
                    Reflect.set(res, "error", message);

                    res.status(statusCode).send({
                        code: statusCode,
                        message,
                    });
                }
            } else {
                // When manual response data
                method.apply(this, [data, res]);
            }
        };

        return descriptor;
    };
}

/**
 * Decorator function for GET requests
 * @param path HTTP route path
 * @param code -
 * - HTTP status code when success default `200`
 * - set `code` to `$` for custom response
 */
export function Get(path?: string, code: number | "$" = OK) {
    return HTTPRequest("get", path || "", code === "$" ? undefined : code);
}

/**
 * Decorator function for POST requests
 * @param path HTTP route path
 * @param code -
 * - HTTP status code when success default `201`
 * - set `code` to `$` for custom response
 */
export function Post(path: string, code: number | "$" = CREATED) {
    return HTTPRequest("post", path, code === "$" ? undefined : code);
}

/**
 * Decorator function for PATCH requests
 * @param path HTTP route path
 * @param code  -
 * - HTTP status code when success default `200`
 * - set `code` to `$` for custom response
 */
export function Patch(path: string, code: number | "$" = OK) {
    return HTTPRequest("patch", path, code === "$" ? undefined : code);
}

/**
 * Decorator function for DELETE requests
 * @param path HTTP route path
 * @param code  -
 * - HTTP status code when success default `200`
 * - set `code` to `$` for custom response
 */
export function Delete(path: string, code: number | "$" = OK) {
    return HTTPRequest("delete", path, code === "$" ? undefined : code);
}

/**
 * A Decorator for Validate Request data
 * @param classDTO class validate DTO
 * @BE_CAREFUL dot not to let request params, query, and body
 * have the same variables name otherwise, they'll be overridden each other
 */
export function ValidateRequest(classDTO: any) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        // Modify the descriptor.value which is the actual method
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response) {
            try {
                // Transform plain object to class instance
                const dto: any = plainToInstance(
                    classDTO,
                    {
                        ...(req?.params || {}),
                        ...(req?.query || {}),
                        ...(req?.body || {}),
                    },
                    { excludeExtraneousValues: true },
                );

                // Validate the class instance
                await validateOrReject(dto);

                // Replace request with dto
                originalMethod.apply(this, [dto, res]);
            } catch (errors: any) {
                let message: string = StatusMessage.BAD_REQUEST;

                if (errors?.length) {
                    const constraint = Object.values(
                        errors[0]?.constraints,
                    ).pop();
                    message = `Property ${constraint}`;
                } else {
                    message = errors?.message || message;
                }

                // set error message to log
                Reflect.set(res, "error", message);

                res.status(BAD_REQUEST).send({
                    code: BAD_REQUEST,
                    message,
                });
            }
        };

        return descriptor;
    };
}

/**
 * A Decorator for Transform Response data
 * @param classTransformResponse to transfrom response data
 */
export function TransformResponse(classTransformResponse: any) {
    return function (target: any, propertyKey: string) {
        // set metadata CLASS_TRANSFORM_RESPONSE to transformed response data
        Reflect.defineMetadata(
            Decorate.CLASS_TRANSFORMER,
            classTransformResponse,
            target,
            propertyKey,
        );
    };
}
