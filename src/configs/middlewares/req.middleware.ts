import { Request, Response, NextFunction } from "express";

import { Logger } from "../../utils/logger.util";

const RequestLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    Logger.Info(
        `[REQUEST]: ${JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            host: req.headers.host,
            data: req.body,
            "content-length": req.headers["content-length"],
            "content-type": req.headers["content-type"],
            "user-agent": req.headers["user-agent"],
        }).replace(/\s+/g, '')}`,
    );

    next();
};

export default RequestLogger;
