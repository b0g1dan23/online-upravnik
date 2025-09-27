import { HttpErrorResponse } from "@angular/common/http";

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

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: UserRoleEnum;
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