import { Issue } from "../tenant/tenant.model";
import { NestError } from "../user/user.model";

export interface EmployeeState {
    buildingIssues: Issue[];
    loading: boolean;
    error: NestError | null;
}