import { createReducer, on } from "@ngrx/store";
import { TenantState } from "./tenant.state";
import { TenantActions } from "./tenant.actions";

export const initialTenantState: TenantState = {
    myIssues: [],
    buildingIssues: [],
    loading: {
        myIssues: false,
        buildingIssues: false
    },
    error: null
}

export const tenantReducer = createReducer(
    initialTenantState,
    on(TenantActions["[Tenant]LoadTenantIssues"], (state) => ({ ...state, loading: { ...state.loading, myIssues: true }, error: null })),
    on(TenantActions["[Tenant]LoadTenantIssuesSuccess"], (state, { issues }) => ({ ...state, myIssues: issues, loading: { ...state.loading, myIssues: false, buildingIssues: false } })),
    on(TenantActions["[Tenant]LoadTenantIssuesFailure"], (state, { error }) => ({ ...state, error, loading: { ...state.loading, myIssues: false, buildingIssues: false } })),

    on(TenantActions["[Tenant]CreateTenantIssue"], (state) => ({ ...state, loading: { ...state.loading, myIssues: true }, error: null })),
    on(TenantActions["[Tenant]CreateTenantIssueSuccess"], (state, { issue }) => ({ ...state, myIssues: [issue, ...state.myIssues], loading: { ...state.loading, myIssues: false } })),
    on(TenantActions["[Tenant]CreateTenantIssueFailure"], (state, { error }) => ({ ...state, error, loading: { ...state.loading, myIssues: false } })),

    on(TenantActions["[BuildingIssues]LoadBuildingIssues"], (state) => ({ ...state, loading: { ...state.loading, buildingIssues: true }, error: null })),
    on(TenantActions["[BuildingIssues]LoadBuildingIssuesSuccess"], (state, { issues }) => ({ ...state, buildingIssues: issues, loading: { ...state.loading, buildingIssues: false } })),
    on(TenantActions["[BuildingIssues]LoadBuildingIssuesFailure"], (state, { error }) => ({ ...state, error, loading: { ...state.loading, buildingIssues: false } })),


    on(TenantActions["[BuildingIssues]IssueUpdated"], (state, { issue }) => {
        const buildingIssueIndex = state.buildingIssues.findIndex(i => i.id === issue.id);

        if (buildingIssueIndex !== -1) {
            const updatedBuildingIssues = [...state.buildingIssues];
            updatedBuildingIssues[buildingIssueIndex] = issue;
            return { ...state, buildingIssues: updatedBuildingIssues };
        }

        return { ...state, buildingIssues: [...state.buildingIssues, issue] };
    }),
    on(TenantActions["[BuildingIssues]NewIssueAdded"], (state, { issue }) => ({ ...state, buildingIssues: [...state.buildingIssues, issue] })),

    on(TenantActions["[MyIssues]IssueUpdated"], (state, { issue }) => {
        const myIssueIndex = state.myIssues.findIndex(i => i.id === issue.id);

        if (myIssueIndex !== -1) {
            const updatedMyIssues = [...state.myIssues];
            updatedMyIssues[myIssueIndex] = issue;
            return { ...state, myIssues: updatedMyIssues };
        }

        return state;
    })
);