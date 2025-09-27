import { NestError } from "../user/user.model";
import { Issue } from "./tenant.model";

export interface TenantState {
    myIssues: Issue[];
    buildingIssues: Issue[];
    loading: {
        myIssues: boolean;
        buildingIssues: boolean;
    };
    webSocket: {
        connected: boolean;
        connecting: boolean;
        error: any | null;
    };
    error: NestError | null;
}