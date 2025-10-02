import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ManagerState } from "./manager.state";

export const selectManagerState = createFeatureSelector<ManagerState>('manager');

export const selectIssuesState = createSelector(selectManagerState, (state) => state.issues);
export const selectAllIssues = createSelector(selectIssuesState, (state) => state.items);
export const selectIssuesLoading = createSelector(selectIssuesState, (state) => state.loading);
export const selectIssuesCurrentPage = createSelector(selectIssuesState, (state) => state.currentPage);
export const selectIssuesHasMorePages = createSelector(selectIssuesState, (state) => state.hasMorePages && !state.loading && !state.loadingMore);
export const selectIssuesError = createSelector(selectIssuesState, (state) => state.error);
export const selectSelectedIssue = createSelector(selectIssuesState, (state) => state.selectedIssue);

export const selectEmployeesState = createSelector(selectManagerState, (state) => state.employees);
export const selectAllEmployees = createSelector(selectEmployeesState, (state) => state.items);
export const selectAllActiveEmployees = createSelector(selectAllEmployees, (employees) => employees.filter(e => e.isActive));
export const selectAllInactiveEmployees = createSelector(selectAllEmployees, (employees) => employees.filter(e => !e.isActive));
export const selectEmployeesLoading = createSelector(selectEmployeesState, (state) => state.loading);
export const selectEmployeesError = createSelector(selectEmployeesState, (state) => state.error);
export const selectSelectedEmployee = createSelector(selectEmployeesState, (state) => state.selectedEmployee);

export const selectBuildingsState = createSelector(selectManagerState, (state) => state.buildings);
export const selectAllBuildings = createSelector(selectBuildingsState, (state) => state.items);
export const selectAllActiveBuildings = createSelector(selectAllBuildings, (buildings) => buildings.filter(b => b.isActive));
export const selectAllInactiveBuildings = createSelector(selectAllBuildings, (buildings) => buildings.filter(b => !b.isActive));
export const selectBuildingsLoading = createSelector(selectBuildingsState, (state) => state.loading);
export const selectBuildingsError = createSelector(selectBuildingsState, (state) => state.error);
export const selectSelectedBuilding = createSelector(selectBuildingsState, (state) => state.selectedBuilding);

export const selectFiltersState = createSelector(selectManagerState, (state) => state.filters);
export const selectIssueFilter = createSelector(selectFiltersState, (state) => state.issueFilter);
export const selectSearchQuery = createSelector(selectFiltersState, (state) => state.searchQuery);

export const selectReportsState = createSelector(selectManagerState, (state) => state.reports);
export const selectCurrentReport = createSelector(selectReportsState, (state) => state.currentReport);
export const selectReportsLoading = createSelector(selectReportsState, (state) => state.loading);
export const selectReportsError = createSelector(selectReportsState, (state) => state.error);

export const selectManagerError = createSelector(selectManagerState, (state) => state.error);