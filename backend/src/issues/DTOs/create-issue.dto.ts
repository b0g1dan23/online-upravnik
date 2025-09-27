import { IsEnum } from "class-validator";
import { ViewBuildingBaseDTO } from "src/buildings/DTOs/view-building.dto";
import { Employee } from "src/employees/employees.entity";
import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { IssueStatusEnum } from "../issues.entity";

export class MinimalInfoIssueDTO {
    problemDescription: string;
}

export class CreateIssueDTO {
    user: ViewUserBaseDTO;
    building: ViewBuildingBaseDTO;
    employeeResponsible: Employee;
    problemDescription: string;

    constructor(user: ViewUserBaseDTO, building: ViewBuildingBaseDTO, employeeResponsible: Employee, problemDescription: string) {
        this.user = user;
        this.building = building;
        this.employeeResponsible = employeeResponsible;
        this.problemDescription = problemDescription;
    }
}

export class UpdateIssueStatusDTO {
    @IsEnum(IssueStatusEnum)
    status: IssueStatusEnum;
}