import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {jwtConstants} from "../auth/constants";
import {Injectable} from "@nestjs/common";
import { Request as RequestType } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }
    private static extractJWT(req: RequestType): string | null {
        if (
            req.cookies &&
            'token' in req.cookies &&
            req.cookies.user_token.length > 0
        ) {
            return req.cookies.token;
        }
        return null;
    }
    async validate(payload: any, req: RequestType) {
        return payload
    }

}