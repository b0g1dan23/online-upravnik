import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsOrder, FindOptionsRelationByString, FindOptionsRelations, Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { CreateEmployeeDTO } from './DTOs/create-employee.dto';
import { SimpleViewEmployeeDTO, ViewEmployeeDTO } from './DTOs/view-employee.dto';
import { Building } from 'src/buildings/buildings.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeesRepository: Repository<Employee>,
        private readonly dataSource: DataSource
    ) { }

    async createEmployee(employeeData: CreateEmployeeDTO) {
        return await this.dataSource.transaction(async manager => {
            const existingEmployee = await manager.findOne(Employee, { where: { email: employeeData.email } });

            if (existingEmployee) {
                throw new ConflictException('Employee with this email already exists');
            }

            const employee = manager.create(Employee, { ...employeeData });
            return new ViewEmployeeDTO(await manager.save(employee));
        })
    }

    async findEmployees() {
        const employees = await this.employeesRepository.find();
        return employees.map(employee => new SimpleViewEmployeeDTO(employee));
    }

    async findActiveEmployees() {
        const employees = await this.employeesRepository.find({ where: { isActive: true } });
        return employees.map(employee => new SimpleViewEmployeeDTO(employee));
    }

    async updateEmployee(employeeID: string, updateData: Partial<CreateEmployeeDTO>) {
        return await this.dataSource.transaction(async manager => {
            const updateResult = await manager.update(Employee, { id: employeeID }, updateData);
            if (updateResult.affected === 0) {
                throw new NotFoundException("Employee with that ID not found!");
            }
            const updatedEmployee = await manager.findOne(Employee, { where: { id: employeeID } });
            return new ViewEmployeeDTO(updatedEmployee!);
        })
    }

    async deleteEmployee(employeeID: string) {
        const updateResult = await this.employeesRepository.update({ id: employeeID }, { isActive: false, deletedAt: new Date() });
        if (updateResult.affected === 0) {
            throw new NotFoundException("Employee with that ID not found!");
        }
        return { employeeID };
    }

    async findEmployeeById(id: string, relations?: FindOptionsRelationByString | FindOptionsRelations<Employee> | undefined, getSortedIssues: boolean = false) {
        let employee: Employee | null = null;
        if (getSortedIssues) {
            employee = await this.employeesRepository
                .createQueryBuilder('employee')
                .leftJoinAndSelect('employee.issuesAssigned', 'issue')
                .leftJoinAndSelect('issue.user', 'user')
                .leftJoinAndSelect('issue.building', 'building')
                .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
                .leftJoinAndSelect('issue.statusHistory', 'statusHistory')
                .leftJoinAndSelect('statusHistory.changedBy', 'statusChanger')
                .leftJoin(
                    qb => qb
                        .select('"issueId", MAX("createdAt") as max_created_at')
                        .from('issue_status', 'is')
                        .groupBy('"issueId"'),
                    'latest_status',
                    'latest_status."issueId" = issue.id'
                )
                .leftJoin(
                    'issue_status',
                    'current_status',
                    'current_status."issueId" = issue.id AND current_status."createdAt" = latest_status.max_created_at'
                )
                .addSelect(`
            CASE 
                WHEN current_status.status = 'REŠENO' THEN 2
                WHEN current_status.status = 'OTKAZANO' THEN 2
                ELSE 1
            END
        `, 'status_order')
                .where('employee.id = :id', { id })
                .orderBy('status_order', 'ASC')
                .addOrderBy('issue.createdAt', 'DESC')
                .getOne();
        } else {
            employee = await this.employeesRepository.findOne({ where: { id }, relations });
        }
        if (!employee) {
            throw new NotFoundException("Employee with that ID not found!");
        }
        if (!employee.isActive) {
            throw new NotFoundException("Employee with that ID is not active!");
        }
        return employee;
    }

    async findEmployeeByEmail(email: string) {
        const employee = await this.employeesRepository.findOne({ where: { email } });
        return employee;
    }

    async findLeastBusyEmployee() {
        const employees = await this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.issuesAssigned', 'issue')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .loadRelationCountAndMap('employee.openIssuesCount', 'employee.issuesAssigned', 'openIssues',
                qb => qb.leftJoin('openIssues.statusHistory', 'openStatus')
                    .where('openStatus.status NOT IN (:...closedStatuses)', {
                        closedStatuses: ['REŠENO', 'OTKAZANO']
                    })
            )
            .getMany();

        if (employees.length === 0) {
            throw new NotFoundException("No employees found!");
        }

        employees.sort((a, b) => (a as any).openIssuesCount - (b as any).openIssuesCount);

        return employees[0];
    }

    async reassignEmployeeForBuilding(buildingId: string, newEmployeeID: string) {
        return await this.dataSource.transaction(async manager => {
            const building = await manager.findOne(Building, {
                where: { id: buildingId },
                relations: { employeeResponsible: true }
            })
            const newEmployee = await manager.findOne(Employee, { where: { id: newEmployeeID, isActive: true } });
            if (!building) {
                throw new NotFoundException("Building with that ID not found!");
            }
            if (!newEmployee) {
                throw new NotFoundException("Employee with that ID not found!");
            }

            await manager.update(Building, { id: buildingId }, { employeeResponsible: newEmployee });
            const savedBuilding = await manager.findOne(Building, { where: { id: buildingId }, relations: { employeeResponsible: true, issues: true } });

            return savedBuilding!;
        });
    }
}
