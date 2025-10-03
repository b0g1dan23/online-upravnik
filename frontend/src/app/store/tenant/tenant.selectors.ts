import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TenantState } from "./tenant.state";

export const selectTenantState = createFeatureSelector<TenantState>('tenant');

export const selectMyIssues = createSelector(selectTenantState, (state) => state.myIssues);
export const selectMyIssuesLoading = createSelector(selectTenantState, (state) => state.loading);

export const selectBuildingIssues = createSelector(selectTenantState, (state) => state.buildingIssues);
export const selectBuildingIssuesLoading = createSelector(selectTenantState, (state) => state.loading);
export const selectTenantError = createSelector(selectTenantState, (state) => state.error);