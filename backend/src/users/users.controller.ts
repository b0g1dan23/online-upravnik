import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ViewUserBaseDTO } from './DTOs/view-user-base.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/custom-decorators/Roles';
import { UserRoleEnum } from './users.entity';
import { CurrentUser } from 'src/custom-decorators/CurrentUser';
import type { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { EmployeesService } from 'src/employees/employees.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly employeesService: EmployeesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Get()
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/from-cookie')
    async findUserFromCookie(@CurrentUser() user: JwtUser): Promise<ViewUserBaseDTO> {
        const loggedUser = await this.usersService.findUserByID(user.id);
        if (!loggedUser || !loggedUser.isActive) {
            const employee = await this.employeesService.findEmployeeById(user.id);
            if (!employee || !employee.isActive) throw new NotFoundException("User not found");
            return new ViewUserBaseDTO(employee);
        }
        return loggedUser;
    }
}
