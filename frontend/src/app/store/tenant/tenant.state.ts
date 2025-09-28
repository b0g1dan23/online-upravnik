import { NestError } from "../user/user.model";
import { Issue } from "./tenant.model";

export interface TenantState {
    myIssues: Issue[];
    buildingIssues: Issue[];
    loading: {
        myIssues: boolean;
        buildingIssues: boolean;
    };
    error: NestError | null;
}