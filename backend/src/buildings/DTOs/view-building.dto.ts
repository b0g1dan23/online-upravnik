import { SimpleViewEmployeeDTO } from "src/employees/DTOs/view-employee.dto";
import { Building } from "../buildings.entity";
import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { ViewIssueForBuildingDTO } from "src/issues/DTOs/view-issue.dto";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ViewBuildingBaseDTO {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    employeeResponsible?: SimpleViewEmployeeDTO;

    isActive: boolean;
    deletedAt: Date | null;

    constructor(building: Building) {
        this.id = building.id;
        this.address = building.address;
        this.name = building.name;
        this.employeeResponsible = building.employeeResponsible ? new SimpleViewEmployeeDTO(building.employeeResponsible) : undefined;
        this.isActive = building.isActive;
        this.deletedAt = building.deletedAt;
    }
}

export class ViewBuildingDTO extends ViewBuildingBaseDTO {
    @IsArray()
    residents: ViewUserBaseDTO[];

    @IsArray()
    issues: ViewIssueForBuildingDTO[];

    constructor(building: Building) {
        super(building);
        this.residents = building.residents?.length > 0 ? building.residents.map(resident => new ViewUserBaseDTO(resident)) : [];
        this.issues = building.issues?.length > 0 ? building.issues.map(issue => new ViewIssueForBuildingDTO(issue)) : [];
    }
}