import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeeState } from "./employee.state";

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');

export const selectBuildingIssuesForEmployee = createSelector(selectEmployeeState, (state) => state.buildingIssues);
export const selectBuildingIssuesForEmployeeLoading = createSelector(selectEmployeeState, (state) => state.loading);
export const selectBuildingIssuesForEmployeeError = createSelector(selectEmployeeState, (state) => state.error);