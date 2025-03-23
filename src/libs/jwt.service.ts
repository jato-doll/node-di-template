import { sign, SignOptions, verify } from "jsonwebtoken";

import { AppEnv } from "../configs/constants.config";
import { Service } from "../utils/decorators/app-registry.decorator";
import { HttpError } from "../utils/http-error.util";

@Service()
export class JWTLibService {
    /**
     * verify user access token 
     * @param token a JWT access as a token from login
     * 
     * @note this function always throw error status code 401
     */
    verifyToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            verify(token, AppEnv.JWT_SECRET, (err, decoded) => {
                if (err) {
                    const errMsg = err?.message ? err.message : String(err);
                    reject(HttpError.Unauthorized(errMsg));
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    signToken(payload: string | Buffer | object, options?: SignOptions) {
        return sign(payload, AppEnv.JWT_SECRET, options);
    }
}
