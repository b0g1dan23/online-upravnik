import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    createEmployee(@Body(ValidationPipe) employeeData: CreateEmployeeDTO) {
        return this.employeesService.createEmployee(employeeData);
    }

    @Get()
    findEmployees() {
        return this.employeesService.findEmployees();
    }
}
