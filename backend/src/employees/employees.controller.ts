import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';
import { Roles } from 'src/custom-decorators/Roles';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleEnum } from 'src/users/users.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ViewEmployeeDTO } from './DTOs/view-employee.dto';
import { ViewBuildingBaseDTO, ViewBuildingDTO } from 'src/buildings/DTOs/view-building.dto';

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

    @Get('/active')
    findActiveEmployees() {
        return this.employeesService.findActiveEmployees();
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

    @Patch('/reassign')
    async reassignEmployeeForBuilding(
        @Body(ValidationPipe) body: { buildingID: string, newEmployeeID: string },
    ) {
        return new ViewBuildingDTO(await this.employeesService.reassignEmployeeForBuilding(body.buildingID, body.newEmployeeID));
    }
}
