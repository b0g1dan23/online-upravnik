import { HttpErrorResponse } from "@angular/common/http";
import { Employee } from "../employee/employee.model";
import { Issue } from "../tenant/tenant.model";

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    buildingLivingInID: string;
}

export enum UserRoleEnum {
    MANAGER = 'MANAGER',
    TENANT = 'TENANT',
    EMPLOYEE = 'EMPLOYEE'
}

export interface Building {
    id: string;
    name: string;
    address: string;
    employeeResponsible: Employee;
    isActive: boolean;
    deletedAt: Date | null;
}

export interface BuildingExpanded extends Building {
    issues: Issue[];
    residents: User[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: UserRoleEnum;
    buildingLivingInID: Building;
    isActive: boolean;
    deletedAt: Date | null;
}

export interface NestError {
    statusCode: number;
    message: string;
    error: string;
}

export class NestErrorResponse {
    statusCode: number;
    message: string;
    error: string;

    constructor(httpError: HttpErrorResponse) {
        const nestError = httpError.error as NestError;

        this.statusCode = nestError?.statusCode ?? httpError.status;
        this.message = nestError?.message ?? httpError.message;
        this.error = nestError?.error ?? httpError.statusText;
    }
}