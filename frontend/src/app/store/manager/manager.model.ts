import { IssueStatusEnum } from "../tenant/tenant.model";

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginationResponse extends PaginationOptions {
    totalCount: number;
    totalPages: number;
}

export interface FilterOptions extends PaginationOptions {
    status: IssueStatusEnum;
    buildingID: string;
    employeeID: string;
    userID: string;
    dateFrom: Date;
    dateTo: Date;
}