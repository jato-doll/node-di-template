import { Request, Response, NextFunction } from "express";

import { Logger } from "../../utils/logger.util";

const ResponseLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    res.on("finish", () => {
        const startHrTime = Reflect.get(res, "startHrTime");
        const statusCode = Reflect.get(res, "statusCode");
        const error = Reflect.get(res, "error");

        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs =
            elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        let logMessage = `[${new Date().toISOString()}] ${req.method} ${
            req.originalUrl
        } ${statusCode} ${elapsedTimeInMs.toFixed(3)}ms`;

        logMessage = error ? logMessage + " | " + error : logMessage;

        if (statusCode >= 200 && statusCode < 300) {
            /**
             * Logging success response
             */
            Logger.Success(logMessage);
        } else if (statusCode >= 300 && statusCode < 400) {
            /**
             * Logging cache response
             */
            Logger.Log(logMessage);
        } else if (statusCode >= 400 && statusCode < 500) {
            /**
             * Logging error validation
             */
            Logger.Warn(logMessage);
        } else if (statusCode >= 500) {
            /**
             * Logging internal server error
             */
            Logger.Error(logMessage);
        }
    });

    next();
};

export default ResponseLogger;
