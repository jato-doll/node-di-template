import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AppEnv } from "../constants.config";
import { AuthRepository } from "../../controllers/auth/auth.repository";
import { HttpError } from "../../utils/http-error.util";
import { JWTLibService } from "../../libs/jwt.service";

const AuthenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers["authorization"];
        const [token] = authHeader ? authHeader.split(" ") : [];

        if (!token) {
            throw HttpError.Unauthorized("Invalid or expired token");
        }

        const jwtLibService = container.resolve<JWTLibService>(
            JWTLibService.name,
        );
        const authRepo = container.resolve<AuthRepository>(AuthRepository.name);

        const payload = await jwtLibService.verifyToken(token);
        const user = await authRepo.findUserId(payload?.userId);
        
        if (!user) {
            throw HttpError.Unauthorized("Invalid user id");
        }

        Reflect.set(req, "user", user);
        next();
    } catch (error) {
        next(error);
    }
};

export default AuthenticateToken;
