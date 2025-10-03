import { Employee, EmployeeDetails } from "../employee/employee.model";
import { Issue, IssueDetails } from "../tenant/tenant.model";
import { Building, BuildingExpanded, NestError } from "../user/user.model";
import { FilterOptions, PaginationResponse } from "./manager.model";

export interface ManagerState {
    issues: {
        items: Issue[];
        pagination: PaginationResponse | null;
        currentPage: number;
        selectedIssue: IssueDetails | null;
        loading: boolean;
        loadingMore: boolean;
        hasMorePages: boolean;
        error: NestError | null;
    };

    employees: {
        items: Employee[];
        selectedEmployee: EmployeeDetails | null;
        loading: boolean;
        error: NestError | null;
    };

    buildings: {
        items: BuildingExpanded[];
        selectedBuilding: BuildingExpanded | null;
        loading: boolean;
        error: NestError | null;
    };

    filters: {
        issueFilter: Partial<FilterOptions> | null;
        searchQuery: string | null;
    };

    // TODO: Do this on backend first
    reports: {
        currentReport: any | null;
        loading: boolean;
        error: NestError | null;
    };

    error: NestError | null;
};
