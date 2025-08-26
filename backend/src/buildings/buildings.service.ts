import { Injectable, NotFoundException } from '@nestjs/common';
import { Building } from './buildings.entity';
import { Repository } from 'typeorm';
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
    ) { }

    async createBuilding(buildingData: CreateBuildingDTO) {
        const building = this.buildingsRepository.create(buildingData);
        building.employeeResponsible = await this.employeesService.findEmployeeById(buildingData.employeeResponsibleId);
        const insertedBuilding = await this.buildingsRepository.save(building);
        return new ViewBuildingDTO(insertedBuilding);
    }

    async findBuildings() {
        const buildings = await this.buildingsRepository.find({
            relations: {
                employeeResponsible: true,
                residents: true,
                issues: true
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
        const buildings = await this.buildingsRepository.find({
            select: {
                id: true,
                address: true,
                name: true,
            }
        });

        return buildings.map(building => new ViewBuildingBaseDTO(building));
    }

    async removeBuilding(id: string) {
        const building = await this.findBuildingByID(id);
        await this.buildingsRepository.remove(building);
        return { message: "Building removed successfully" };
    }

    async removeAllBuildings() {
        const buildings = await this.findBuildings();
        buildings.forEach(async (building) => {
            await this.buildingsRepository.remove(building);
        });
        return { message: "All buildings removed successfully" };
    }
}
