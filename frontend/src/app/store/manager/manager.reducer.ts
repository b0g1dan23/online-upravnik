import { createReducer, on } from "@ngrx/store";
import { ManagerState } from "./manager.state";
import { ManagerActions } from "./manager.actions";

export const initialManagerState: ManagerState = {
    issues: {
        items: [],
        pagination: null,
        currentPage: 0,
        selectedIssue: null,
        loading: false,
        loadingMore: false,
        hasMorePages: false,
        error: null
    },

    employees: {
        items: [],
        selectedEmployee: null,
        loading: false,
        error: null
    },

    buildings: {
        items: [],
        selectedBuilding: null,
        loading: false,
        error: null
    },

    filters: {
        issueFilter: null,
        searchQuery: null,
    },

    reports: {
        currentReport: null,
        loading: false,
        error: null
    },

    error: null
}

export const managerReducer = createReducer(
    initialManagerState,
    on(ManagerActions["[Issue]LoadIssues"], (state) => ({ ...state, issues: { ...state.issues, loading: true, error: null } })),
    on(ManagerActions["[Issue]LoadIssuesSuccess"], (state, { issues, pagination, isFirstPage }) => ({
        ...state, issues: {
            ...state.issues, items: isFirstPage ? issues : [...state.issues.items, ...issues], pagination, currentPage: pagination.page, hasMorePages: pagination.page < pagination.totalPages, loading: false
        }
    })),
    on(ManagerActions["[Issue]LoadIssuesFailure"], (state, { error }) => ({ ...state, issues: { ...state.issues, loading: false, error } })),
    on(ManagerActions["[Issue]ResetIssues"], (state) => ({ ...state, issues: { ...initialManagerState.issues } })),

    on(ManagerActions["[Issue]LoadIssueByID"], (state) => ({ ...state, issues: { ...state.issues, loading: true, error: null } })),
    on(ManagerActions["[Issue]LoadIssueByIDSuccess"], (state, { issue }) => ({ ...state, issues: { ...state.issues, selectedIssue: issue, loading: false } })),
    on(ManagerActions["[Issue]LoadIssueByIDFailure"], (state, { error }) => ({ ...state, issues: { ...state.issues, loading: false, error } })),

    on(ManagerActions["[Employee]LoadAllEmployees"], (state) => ({ ...state, employees: { ...state.employees, loading: true, error: null } })),
    on(ManagerActions["[Employee]LoadAllEmployeesSuccess"], (state, { employees }) => ({ ...state, employees: { ...state.employees, items: employees, loading: false } })),
    on(ManagerActions["[Employee]LoadAllEmployeesFailure"], (state, { error }) => ({ ...state, employees: { ...state.employees, loading: false, error } })),

    on(ManagerActions["[Employee]LoadEmployeeByID"], (state) => ({ ...state, employees: { ...state.employees, loading: true, error: null } })),
    on(ManagerActions["[Employee]LoadEmployeeByIDSuccess"], (state, { employee }) => ({ ...state, employees: { ...state.employees, selectedEmployee: employee, loading: false } })),
    on(ManagerActions["[Employee]LoadEmployeeByIDFailure"], (state, { error }) => ({ ...state, employees: { ...state.employees, loading: false, error } })),

    on(ManagerActions["[Employee]AddEmployee"], (state) => ({ ...state, employees: { ...state.employees, loading: true, error: null } })),
    on(ManagerActions["[Employee]AddEmployeeSuccess"], (state, { employee }) => ({ ...state, employees: { ...state.employees, items: [...state.employees.items, employee], loading: false } })),
    on(ManagerActions["[Employee]AddEmployeeFailure"], (state, { error }) => ({ ...state, employees: { ...state.employees, loading: false, error } })),

    on(ManagerActions["[Employee]UpdateEmployee"], (state) => ({ ...state, employees: { ...state.employees, loading: true, error: null } })),
    on(ManagerActions["[Employee]UpdateEmployeeSuccess"], (state, { employee }) => ({
        ...state, employees: {
            ...state.employees,
            items: state.employees.items.map(emp => emp.id === employee.id ? employee : emp),
            loading: false
        }
    })),
    on(ManagerActions["[Employee]UpdateEmployeeFailure"], (state, { error }) => ({ ...state, employees: { ...state.employees, loading: false, error } })),

    on(ManagerActions["[Employee]DeleteEmployee"], (state) => ({ ...state, employees: { ...state.employees, loading: true, error: null } })),
    on(ManagerActions["[Employee]DeleteEmployeeSuccess"], (state, { employeeID }) => ({
        ...state, employees: {
            ...state.employees,
            items: state.employees.items.map(emp => emp.id === employeeID ? ({ ...emp, isActive: false }) : emp),
            loading: false
        }
    })),
    on(ManagerActions["[Employee]DeleteEmployeeFailure"], (state, { error }) => ({ ...state, employees: { ...state.employees, loading: false, error } })),

    on(ManagerActions["[Building]LoadAllBuildings"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]LoadAllBuildingsSuccess"], (state, { buildings }) => ({ ...state, buildings: { ...state.buildings, items: buildings, loading: false } })),
    on(ManagerActions["[Building]LoadAllBuildingsFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Building]ReassingEmployeeToBuilding"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]ReassingEmployeeToBuildingSuccess"], (state, { building }) => ({
        ...state, buildings: { ...state.buildings, items: state.buildings.items.map(bld => bld.id === building.id ? building : bld), loading: false }
    })),
    on(ManagerActions["[Building]ReassingEmployeeToBuildingFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Building]UpdateBuildingName"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]UpdateBuildingNameSuccess"], (state, { buildingID, name }) => ({
        ...state, buildings: { ...state.buildings, items: state.buildings.items.map(bld => bld.id === buildingID ? { ...bld, name } : bld), loading: false }
    })),
    on(ManagerActions["[Building]UpdateBuildingNameFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Building]DeleteBuilding"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]DeleteBuildingSuccess"], (state, { buildingID }) => ({
        ...state, buildings: { ...state.buildings, items: state.buildings.items.map((b) => b.id === buildingID ? { ...b, isActive: false } : b), loading: false }
    })),
    on(ManagerActions["[Building]DeleteBuildingFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Building]ReturnInactiveBuildingToActive"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]ReturnInactiveBuildingToActiveSuccess"], (state, { buildingID }) => ({
        ...state, buildings: { ...state.buildings, items: state.buildings.items.map((b) => b.id === buildingID ? { ...b, isActive: true } : b), loading: false }
    })),
    on(ManagerActions["[Building]ReturnInactiveBuildingToActiveFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Building]AddBuilding"], (state) => ({ ...state, buildings: { ...state.buildings, loading: true, error: null } })),
    on(ManagerActions["[Building]AddBuildingSuccess"], (state, { building }) => ({ ...state, buildings: { ...state.buildings, items: [...state.buildings.items, building], loading: false } })),
    on(ManagerActions["[Building]AddBuildingFailure"], (state, { error }) => ({ ...state, buildings: { ...state.buildings, loading: false, error } })),

    on(ManagerActions["[Filter]SetIssueFilter"], (state) => ({ ...state, filters: { ...state.filters }, issues: { ...state.issues, loading: true, error: null } })),
    on(ManagerActions["[Filter]SetIssueFilterSuccess"], (state, { issues, pagination }) => ({
        ...state, filters: { ...state.filters }, issues: { ...state.issues, items: issues, pagination, loading: false }
    })),
    on(ManagerActions["[Filter]SetIssueFilterFailure"], (state, { error }) => ({ ...state, issues: { ...state.issues, loading: false, error } })),
    on(ManagerActions["[Filter]ClearIssueFilter"], (state) => ({ ...state, filters: { ...state.filters, issueFilter: null }, issues: { ...state.issues, items: [], pagination: null } })),

    on(ManagerActions["[Search]SearchIssues"], (state, { query }) => ({ ...state, filters: { ...state.filters, searchQuery: query }, issues: { ...state.issues, loading: true, error: null } })),
    on(ManagerActions["[Search]SearchIssuesSuccess"], (state, { issues, pagination }) => ({
        ...state, filters: { ...state.filters }, issues: { ...state.issues, items: issues, pagination, loading: false }
    })),
    on(ManagerActions["[Search]SearchIssuesFailure"], (state, { error }) => ({ ...state, issues: { ...state.issues, loading: false, error } })),
    on(ManagerActions["[Search]ClearIssueSearch"], (state) => ({ ...state, filters: { ...state.filters, searchQuery: null }, issues: { ...state.issues, items: [], pagination: null } })),

    // on(ManagerActions["[Report]GenerateReport"], (state) => ({ ...state, reports: { ...state.reports, loading: true, error: null } })),
    // on(ManagerActions["[Report]GenerateReportSuccess"], (state, { report }) => ({ ...state, reports: { ...state.reports, currentReport: report, loading: false } })),
    // on(ManagerActions["[Report]GenerateReportFailure"], (state, { error }) => ({ ...state, reports: { ...state.reports, loading: false, error } })),

    on(ManagerActions["[IssueWebSocket]NewIssueAdded"], (state, { issue }) => ({ ...state, issues: { ...state.issues, items: [issue, ...state.issues.items] } })),
    on(ManagerActions["[IssueWebSocket]IssueUpdated"], (state, { issue }) => ({ ...state, issues: { ...state.issues, items: state.issues.items.map(iss => iss.id === issue.id ? issue : iss) } })),
)
