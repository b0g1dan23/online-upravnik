import { Employee } from "../employee/employee.model";
import { Building, User } from "../user/user.model";

export enum IssueStatusEnum {
    REPORTED = 'PRIJAVLJENO',
    IN_PROGRESS = 'U_TOKU',
    RESOLVED = 'REŠENO',
    CANCELLED = 'OTKAZANO'
}

export interface IssueStatus {
    id: string;
    status: IssueStatusEnum;
    changedBy?: Employee;
    createdAt: string;
}

export interface Issue {
    id: string;
    problemDescription: string;
    user: User;
    building: Building;
    employeeResponsible: Employee;
    currentStatus: IssueStatus;
    createdAt: Date;
}

export interface CreateIssueDTO {
    problemDescription: string;
}

export interface IssueDetails extends Omit<Issue, 'currentStatus'> {
    statusHistory: IssueStatus[];
}