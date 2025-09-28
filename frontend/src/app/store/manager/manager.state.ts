import { Employee } from "../employee/employee.model";
import { Issue } from "../tenant/tenant.model";
import { Building, NestError } from "../user/user.model";
import { FilterOptions, PaginationResponse } from "./manager.model";

export interface ManagerState {
    issues: {
        items: Issue[];
        pagination: PaginationResponse | null;
        selectedIssue: Issue | null;
        loading: boolean;
        loadingMore: boolean;
        hasMorePages: boolean;
        error: NestError | null;
    };

    employees: {
        items: Employee[];
        selectedEmployee: Employee | null;
        loading: boolean;
        error: NestError | null;
    };

    buildings: {
        items: Building[];
        selectedBuilding: Building | null;
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
