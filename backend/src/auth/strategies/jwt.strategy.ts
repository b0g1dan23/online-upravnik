import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtUser } from "../interfaces/jwt-user.interface";
import { UserRoleEnum } from "src/users/users.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not set.");
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    validate(payload: any): JwtUser {
        if (!payload.id || !payload.role) {
            throw new UnauthorizedException('Invalid JWT payload: missing required fields');
        }

        if (!Object.values(UserRoleEnum).includes(payload.role)) {
            throw new UnauthorizedException('Invalid user role');
        }

        return { id: payload.id, role: payload.role };
    }
}