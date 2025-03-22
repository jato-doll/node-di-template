import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { container } from "tsyringe";
import { AppEnv } from "../constants.config";
import { AuthRepository } from "../../controllers/auth/auth.repository";
import { HttpError } from "../../utils/http-error.config";

const AuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const [token] = authHeader ? authHeader.split(" ") : [];

    if (!token) {
        throw HttpError.Unauthorized("Invalid or expired token");
    } else {
        verify(token, AppEnv.JWT_SECRET, async (err: any, { userId }: any) => {
            if (err) {
                throw HttpError.Unauthorized("Invalid or expired token");
            }

            const authRepo = container.resolve<AuthRepository>(
                AuthRepository.name,
            );

            const user = await authRepo.findUserId(userId);
            if (!user) {
                throw HttpError.Unauthorized("Invalid user id");
            }

            Reflect.set(req, "user", user);
            next();
        });
    }
};

export default AuthenticateToken;
