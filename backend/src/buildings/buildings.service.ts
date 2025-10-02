import { Injectable, NotFoundException } from '@nestjs/common';
import { Building } from './buildings.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBuildingDTO } from './DTOs/create-building.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { ViewBuildingBaseDTO, ViewBuildingDTO } from './DTOs/view-building.dto';

@Injectable()
export class BuildingsService {
    constructor(
        @InjectRepository(Building)
        private readonly buildingsRepository: Repository<Building>,
        private readonly employeesService: EmployeesService,
        private readonly dataSource: DataSource
    ) { }

    async createBuilding(buildingData: CreateBuildingDTO) {
        return await this.dataSource.transaction(async manager => {
            const building = manager.create(Building, buildingData);
            building.employeeResponsible = await this.employeesService.findEmployeeById(buildingData.employeeResponsibleId);
            const insertedBuilding = await manager.save(building);
            return new ViewBuildingDTO(insertedBuilding);
        })
    }

    async findBuildings() {
        const buildings = await this.buildingsRepository.find({
            relations: {
                employeeResponsible: true,
                residents: true,
                issues: {
                    statusHistory: true,
                    user: true,
                    employeeResponsible: true
                }
            }
        });
        return buildings;
    }

    async findBuildingByID(id: string) {
        const building = await this.buildingsRepository.findOne({ where: { id } });
        if (!building) {
            throw new NotFoundException('Building not found');
        }
        return building;
    }

    async listAllBuildingsShorthand() {
        const buildings = await this.buildingsRepository.query(`SELECT id, address, name FROM building WHERE "isActive" = true`);

        return buildings.map(building => new ViewBuildingBaseDTO(building));
    }

    async removeBuilding(id: string) {
        const updateResult = await this.buildingsRepository.update({
            id
        }, {
            isActive: false,
            deletedAt: new Date()
        })
        if (updateResult.affected === 0) {
            throw new NotFoundException("Building with that ID not found!");
        }
        return { buildingID: id };
    }

    async removeAllBuildings() {
        const deleteResult = await this.buildingsRepository.deleteAll();
        if (deleteResult.affected === 0) {
            throw new NotFoundException("No buildings found to delete!");
        }
        return { message: "All buildings removed successfully" };
    }

    async updateBuildingName(buildingID: string, newName: string) {
        const updateResult = await this.buildingsRepository.update({ id: buildingID }, { name: newName });
        if (updateResult.affected === 0) {
            throw new NotFoundException("Building with that ID not found!");
        }
        return { buildingID, name: newName };
    }

    async updateInactiveBuildingToActive(id: string) {
        const updateResult = await this.buildingsRepository.update({ id }, { isActive: true, deletedAt: null });
        if (updateResult.affected === 0) {
            throw new NotFoundException("Building with that ID not found!");
        }
        return { buildingID: id };
    }
}
