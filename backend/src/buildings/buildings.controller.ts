import { Body, Controller, Delete, Get, Param, Post, ValidationPipe, ParseUUIDPipe, UseGuards, Put } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDTO } from './DTOs/create-building.dto';
import { ViewBuildingDTO } from './DTOs/view-building.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/custom-decorators/Roles';
import { UserRoleEnum } from 'src/users/users.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('buildings')
export class BuildingsController {
    constructor(private readonly buildingsService: BuildingsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Post()
    createBuilding(@Body(ValidationPipe) buildingData: CreateBuildingDTO) {
        return this.buildingsService.createBuilding(buildingData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Get()
    async findBuildings() {
        const buildings = await this.buildingsService.findBuildings();
        return buildings.map(building => new ViewBuildingDTO(building));
    }

    @Get('/list')
    listBuildings() {
        return this.buildingsService.listAllBuildingsShorthand();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Delete('/:id')
    removeBuilding(@Param('id', ParseUUIDPipe) id: string) {
        return this.buildingsService.removeBuilding(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Delete()
    removeAllBuildings() {
        return this.buildingsService.removeAllBuildings();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Put('/:id/name')
    updateBuilding(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) updateData: { name: string }) {
        return this.buildingsService.updateBuildingName(id, updateData.name);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Put('/:id/activate')
    updateBuildingFromInactiveToActive(@Param('id', ParseUUIDPipe) id: string) {
        return this.buildingsService.updateInactiveBuildingToActive(id);
    }
}
