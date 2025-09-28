import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { Employee } from "../employees.entity";
import { ViewIssueEmployeeDTO } from "src/issues/DTOs/view-issue.dto";
import { ViewBuildingBaseDTO } from "src/buildings/DTOs/view-building.dto";

export class ViewEmployeeDTO extends ViewUserBaseDTO {
    position: string;
    issuesAssigned: ViewIssueEmployeeDTO[];
    buildings: ViewBuildingBaseDTO[];

    constructor(employee: Employee) {
        super(employee);
        this.position = employee.position;
        this.issuesAssigned = employee.issuesAssigned ? employee.issuesAssigned.map((issue) => new ViewIssueEmployeeDTO(issue)) : [];
        this.buildings = employee.buildings ? employee.buildings.map((building) => new ViewBuildingBaseDTO(building)) : [];
    }
}

export class SimpleViewEmployeeDTO extends ViewUserBaseDTO {
    position: string;

    constructor(employee: Employee) {
        super(employee);
        this.position = employee.position;
    }
}