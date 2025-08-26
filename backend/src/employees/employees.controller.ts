import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';
import { Roles } from 'src/custom-decorators/Roles';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleEnum } from 'src/users/users.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Post()
    createEmployee(@Body(ValidationPipe) employeeData: CreateEmployeeDTO) {
        return this.employeesService.createEmployee(employeeData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Get()
    findEmployees() {
        return this.employeesService.findEmployees();
    }
}
