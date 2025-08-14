import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeesRepository: Repository<Employee>
    ) { }

    async createEmployee(employeeData: CreateEmployeeDTO) {
        const existingEmployee = await this.employeesRepository.findOne({ where: { email: employeeData.email } });

        if (existingEmployee) {
            throw new ConflictException('Employee with this email already exists');
        }

        const employee = this.employeesRepository.create({ ...employeeData });
        return this.employeesRepository.save(employee);
    }

    async findEmployees() {
        return this.employeesRepository.find();
    }

    async findEmployeeById(id: string) {
        const employee = await this.employeesRepository.findOne({ where: { id } });
        if (!employee) {
            throw new NotFoundException("Employee with that ID not found!");
        }
        return employee;
    }
}
