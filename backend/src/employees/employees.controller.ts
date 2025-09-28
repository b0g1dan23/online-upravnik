import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';
import { Roles } from 'src/custom-decorators/Roles';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleEnum } from 'src/users/users.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ViewEmployeeDTO } from './DTOs/view-employee.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.MANAGER)
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

    @Get('/:employeeID')
    async findEmployeeById(@Param('employeeID', ParseUUIDPipe) employeeID: string) {
        const employee = await this.employeesService.findEmployeeById(employeeID, ['issuesAssigned',
            'issuesAssigned.user',
            'issuesAssigned.building',
            'issuesAssigned.statusHistory',
            'buildings']);
        return new ViewEmployeeDTO(employee);
    }

    @Put('/:employeeID')
    async updateEmployee(@Param('employeeID', ParseUUIDPipe) employeeID: string, @Body(ValidationPipe) updateData: Partial<CreateEmployeeDTO>) {
        return this.employeesService.updateEmployee(employeeID, updateData);
    }

    @Delete('/:employeeID')
    async deleteEmployee(@Param('employeeID', ParseUUIDPipe) employeeID: string) {
        return this.employeesService.deleteEmployee(employeeID);
    }

    @Put('/reassign/:buildingID/:newEmployeeID')
    async reassignEmployeeForBuilding(
        @Param('buildingID', ParseUUIDPipe) buildingID: string,
        @Param('newEmployeeID', ParseUUIDPipe) newEmployeeID: string
    ) {
        return this.employeesService.reassignEmployeeForBuilding(buildingID, newEmployeeID);
    }
}
