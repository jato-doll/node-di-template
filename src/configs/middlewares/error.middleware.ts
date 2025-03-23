import { Request, Response, NextFunction } from "express";

import { HttpError } from "../../utils/http-error.util";

const ErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ code: statusCode, error: message });
};

export default ErrorHandler;
