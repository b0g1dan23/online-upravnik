import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Building, NestError } from "../user/user.model";
import { Issue } from "../tenant/tenant.model";
import { CreateEmployeeDTO, Employee } from "../employee/employee.model";
import { FilterOptions, PaginationOptions, PaginationResponse } from "./manager.model";

export const ManagerActions = createActionGroup({
    source: 'Manager',
    events: {
        '[Issue] Load First Page for Manager': props<PaginationOptions>(),
        '[Issue] Load First Page for Manager Success': props<{
            issues: Issue[], pagination: PaginationResponse
        }>(),
        '[Issue] Load First Page for Manager Failure': props<{ error: NestError }>(),

        '[Issue] Load More Issues for Manager': props<{ page: number }>(),
        '[Issue] Load More Issues for Manager Success': props<{
            issues: Issue[], pagination: PaginationResponse
        }>(),
        '[Issue] Load More Issues for Manager Failure': props<{ error: NestError }>(),

        '[Employee] Load All Employees': emptyProps(),
        '[Employee] Load All Employees Success': props<{ employees: Employee[] }>(),
        '[Employee] Load All Employees Failure': props<{ error: NestError }>(),

        '[Employee] Load Employee by ID': props<{ employeeID: string }>(),
        '[Employee] Load Employee by ID Success': props<{ employee: Employee }>(),
        '[Employee] Load Employee by ID Failure': props<{ error: NestError }>(),

        '[Employee] Add Employee': props<{ employee: CreateEmployeeDTO }>(),
        '[Employee] Add Employee Success': props<{ employee: Employee }>(),
        '[Employee] Add Employee Failure': props<{ error: NestError }>(),

        '[Employee] Update Employee': props<{ employeeID: string, newEmployee: Partial<CreateEmployeeDTO> }>(),
        '[Employee] Update Employee Success': props<{ employee: Employee }>(),
        '[Employee] Update Employee Failure': props<{ error: NestError }>(),

        '[Employee] Delete Employee': props<{ employeeID: string }>(),
        '[Employee] Delete Employee Success': props<{ employeeID: string }>(),
        '[Employee] Delete Employee Failure': props<{ error: NestError }>(),

        '[Building] Load All Buildings': emptyProps(),
        '[Building] Load All Buildings Success': props<{ buildings: Building[] }>(),
        '[Building] Load All Buildings Failure': props<{ error: NestError }>(),

        '[Building] Reassing Employee to Building': props<{ buildingID: string, employeeID: string }>(),
        '[Building] Reassing Employee to Building Success': props<{ building: Building }>(),
        '[Building] Reassing Employee to Building Failure': props<{ error: NestError }>(),

        '[Building] Update building name': props<{ buildingID: string, name: string }>(),
        '[Building] Update building name Success': props<{ buildingID: string, name: string }>(),
        '[Building] Update building name Failure': props<{ error: NestError }>(),

        '[Building] Delete Building': props<{ buildingID: string }>(),
        '[Building] Delete Building Success': props<{ buildingID: string }>(),
        '[Building] Delete Building Failure': props<{ error: NestError }>(),

        '[Building] Add Building': props<{ name: string }>(),
        '[Building] Add Building Success': props<{ building: Building }>(),
        '[Building] Add Building Failure': props<{ error: NestError }>(),

        // TODO: Do this on backend first
        '[Report] Generate Report': props<{ buildingID: string, dateRange: { start: Date, end: Date } }>(),
        '[Report] Generate Report Success': props<{ report: any }>(),
        '[Report] Generate Report Failure': props<{ error: NestError }>(),

        '[Filter] Set Issue Filter': props<{ filter: Partial<FilterOptions> }>(),
        '[Filter] Set Issue Filter Success': props<{ issues: Issue[], pagination: PaginationResponse }>(),
        '[Filter] Set Issue Filter Failure': props<{ error: NestError }>(),
        '[Filter] Clear Issue Filter': emptyProps(),

        '[Search] Search issues': props<{ query: string }>(),
        '[Search] Search issues Success': props<{ issues: Issue[], pagination: PaginationResponse }>(),
        '[Search] Search issues Failure': props<{ error: NestError }>(),
        '[Search] Clear issue search': emptyProps(),

        '[Issue WebSocket] New Issue Added': props<{ issue: Issue }>(),
        '[Issue WebSocket] Issue Updated': props<{ issue: Issue }>(),
    }
})