import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtUser } from "src/auth/interfaces/jwt-user.interface";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);