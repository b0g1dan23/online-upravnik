import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../custom-decorators/Roles';
import { Observable } from 'rxjs';
import { UserRoleEnum } from 'src/users/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles)
            return true;

        const user = context.switchToHttp().getRequest().user;

        if (!user)
            throw new ForbiddenException('User not authenticated');

        if (!user.role)
            throw new ForbiddenException('User role not defined');

        if (user.role === UserRoleEnum.MANAGER)
            return true;

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole)
            throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);

        return true;
    }
}