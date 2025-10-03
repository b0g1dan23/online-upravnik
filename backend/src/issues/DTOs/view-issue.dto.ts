import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { Issue, IssuePicture, IssuePictureType, IssueStatus, IssueStatusEnum } from "../issues.entity";
import { SimpleViewEmployeeDTO, ViewEmployeeDTO } from "src/employees/DTOs/view-employee.dto";
import { ViewBuildingBaseDTO } from "src/buildings/DTOs/view-building.dto";

export class ViewIssueDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO | undefined;
    building: ViewBuildingBaseDTO | undefined;
    employeeResponsible: ViewEmployeeDTO | undefined;
    statusHistory: ViewIssueStatusDTO[] | undefined;
    pictures: ViewIssuePictureDTO[] | undefined;
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = issue.user ? new ViewUserBaseDTO(issue.user) : undefined;
        this.building = issue.building ? new ViewBuildingBaseDTO(issue.building) : undefined;
        this.employeeResponsible = issue.employeeResponsible ? new ViewEmployeeDTO(issue.employeeResponsible) : undefined;
        this.statusHistory = issue.statusHistory && issue.statusHistory.length > 0 ? issue.statusHistory.map(status => new ViewIssueStatusDTO(status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) : undefined;
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueCurrentStatusDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO;
    building: ViewBuildingBaseDTO;
    employeeResponsible: SimpleViewEmployeeDTO;
    currentStatus: ViewIssueStatusDTO;
    pictures: ViewIssuePictureDTO[];
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = new ViewUserBaseDTO(issue.user);
        this.building = new ViewBuildingBaseDTO(issue.building);
        this.employeeResponsible = new SimpleViewEmployeeDTO(issue.employeeResponsible);
        this.currentStatus = issue.statusHistory.map(status => new ViewIssueStatusDTO(status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueForBuildingDTO {
    id: string;
    problemDescription: string;
    user?: ViewUserBaseDTO;
    employeeResponsible?: SimpleViewEmployeeDTO;
    currentStatus?: ViewIssueStatusDTO;
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = issue.user ? new ViewUserBaseDTO(issue.user) : undefined;
        this.employeeResponsible = issue.employeeResponsible ? new SimpleViewEmployeeDTO(issue.employeeResponsible) : undefined;
        this.currentStatus = issue.statusHistory?.length > 0
            ? issue.statusHistory.map(status => new ViewIssueStatusDTO(status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
            : undefined;
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueEmployeeDTO {
    id: string;
    problemDescription: string;
    user: ViewUserBaseDTO;
    building: ViewBuildingBaseDTO;
    currentStatus: ViewIssueStatusDTO;
    createdAt: Date;

    constructor(issue: Issue) {
        this.id = issue.id;
        this.problemDescription = issue.problemDescription;
        this.user = new ViewUserBaseDTO(issue.user);
        this.building = new ViewBuildingBaseDTO(issue.building);
        this.currentStatus = issue.statusHistory.map(status => new ViewIssueStatusDTO(status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
        this.createdAt = issue.createdAt;
    }
}

export class ViewIssueStatusDTO {
    id: string;
    status: IssueStatusEnum;
    changedBy?: SimpleViewEmployeeDTO;
    createdAt: Date;

    constructor(issueStatus: IssueStatus) {
        this.id = issueStatus.id;
        this.status = issueStatus.status;
        this.changedBy = issueStatus.changedBy ? new SimpleViewEmployeeDTO(issueStatus.changedBy) : undefined;
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