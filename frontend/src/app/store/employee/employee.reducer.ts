import { createReducer, on } from "@ngrx/store";
import { EmployeeState } from "./employee.state";
import { EmployeeActions } from "./employee.actions";

export const initialEmployeeState: EmployeeState = {
    buildingIssues: [],
    loading: false,
    error: null
}

export const employeeReducer = createReducer(
    initialEmployeeState,
    on(EmployeeActions["[Issue]LoadAllIssuesForBuilding"], (state) => ({ ...state, loading: true, error: null })),
    on(EmployeeActions["[Issue]LoadAllIssuesForBuildingSuccess"], (state, { issues }) => ({ ...state, buildingIssues: issues, loading: false })),
    on(EmployeeActions["[Issue]LoadAllIssuesForBuildingFailure"], (state, { error }) => ({ ...state, error, loading: false })),

    on(EmployeeActions["[Issue]ChangeIssueStatus"], (state) => ({ ...state, loading: true, error: null })),
    on(EmployeeActions["[Issue]ChangeIssueStatusSuccess"], (state, { issue }) => {
        const updatedIssues = state.buildingIssues.map(i => i.id === issue.id ? issue : i);
        return { ...state, buildingIssues: updatedIssues, loading: false };
    }),
    on(EmployeeActions["[Issue]ChangeIssueStatusFailure"], (state, { error }) => ({ ...state, error, loading: false })),

    on(EmployeeActions["[IssueWebSocket]NewIssueAssigned"], (state, { issue }) => {
        const updatedIssues = [...state.buildingIssues, issue];
        return { ...state, buildingIssues: updatedIssues };
    })
)