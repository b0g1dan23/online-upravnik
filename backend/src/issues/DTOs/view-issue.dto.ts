import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { Issue, IssuePicture, IssuePictureType, IssueStatus, IssueStatusEnum } from "../issues.entity";
import { ViewEmployeeDTO } from "src/employees/DTOs/view-employee.dto";
import { ViewBuildingBaseDTO } from "src/buildings/DTOs/view-building.dto";
import { IsEnum } from "class-validator";

export class ViewIssueDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO;
    building: ViewBuildingBaseDTO;
    employeeResponsible: ViewEmployeeDTO;
    statusHistory: ViewIssueStatusDTO[];
    pictures: ViewIssuePictureDTO[];
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = new ViewUserBaseDTO(issue.user);
        this.building = new ViewBuildingBaseDTO(issue.building);
        this.employeeResponsible = new ViewEmployeeDTO(issue.employeeResponsible);
        this.statusHistory = issue.statusHistory.map(status => new ViewIssueStatusDTO(status));
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueCurrentStatusDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO;
    building: ViewBuildingBaseDTO;
    employeeResponsible: ViewEmployeeDTO;
    currentStatus: ViewIssueStatusDTO;
    pictures: ViewIssuePictureDTO[];
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = new ViewUserBaseDTO(issue.user);
        this.building = new ViewBuildingBaseDTO(issue.building);
        this.employeeResponsible = new ViewEmployeeDTO(issue.employeeResponsible);
        this.currentStatus = issue.statusHistory.map(status => new ViewIssueStatusDTO(status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueStatusDTO {
    id: string;
    status: IssueStatusEnum;
    changedBy?: ViewEmployeeDTO;
    createdAt: Date;

    constructor(issueStatus: IssueStatus) {
        this.id = issueStatus.id;
        this.status = issueStatus.status;
        this.changedBy = issueStatus.changedBy ? new ViewEmployeeDTO(issueStatus.changedBy) : undefined;
        this.createdAt = issueStatus.createdAt;
    }
}

export class ViewIssuePictureDTO {
    id: string;
    filePath: string;
    type: IssuePictureType;
    uploadedBy: ViewUserBaseDTO;
    createdAt: Date;

    constructor(issuePicture: IssuePicture) {
        this.id = issuePicture.id;
        this.filePath = issuePicture.filePath;
        this.type = issuePicture.type;
        this.uploadedBy = new ViewUserBaseDTO(issuePicture.uploadedBy);
        this.createdAt = issuePicture.createdAt;
    }
}