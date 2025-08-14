import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { Issue, IssuePicture, IssuePictureType, IssueStatus, IssueStatusEnum } from "../issues.entity";
import { ViewBuildingDTO } from "src/buildings/DTOs/view-building.dto";
import { ViewEmployeeDTO } from "src/employees/DTOs/view-employee.dto";

export class ViewIssueDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO;
    building: ViewBuildingDTO;
    employeeResponsible: ViewEmployeeDTO;
    statusHistory: IssueStatus[];
    pictures: IssuePicture[];
    notifications: Notification[];
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = new ViewUserBaseDTO(issue.user);
        this.building = new ViewBuildingDTO(issue.building);
        this.employeeResponsible = new ViewEmployeeDTO(issue.employeeResponsible);
    }
}

export class ViewIssueStatusDTO {
    id: string;
    status: IssueStatusEnum;
    changedBy?: ViewEmployeeDTO;

    constructor(issueStatus: IssueStatus) {
        this.id = issueStatus.id;
        this.status = issueStatus.status;
        this.changedBy = issueStatus.changedBy ? new ViewEmployeeDTO(issueStatus.changedBy) : undefined;
    }
}

export class ViewIssuePictureDTO {
    id: string;
    filePath: string;
    type: IssuePictureType;
    uploadedBy: ViewUserBaseDTO;
    createdAt: Date;
}