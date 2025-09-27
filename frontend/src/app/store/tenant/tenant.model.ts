import { Building, User } from "../user/user.model";

export interface Employee extends User {
    position: string;
}

export enum IssueStatusEnum {
    REPORTED = 'REPORTED',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CANCELLED = 'CANCELLED'
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