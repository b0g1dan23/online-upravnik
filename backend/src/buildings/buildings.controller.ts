import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDTO } from './DTOs/create-building.dto';

@Controller('buildings')
export class BuildingsController {
    constructor(private readonly buildingsService: BuildingsService) { }

    @Post()
    createBuilding(@Body(ValidationPipe) buildingData: CreateBuildingDTO) {
        return this.buildingsService.createBuilding(buildingData);
    }

    @Get()
    findBuildings() {
        return this.buildingsService.findBuildings();
    }
}
