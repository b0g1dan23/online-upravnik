import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ManagerActions } from "./manager.actions";
import { catchError, map, mergeMap, of, withLatestFrom } from "rxjs";
import { Issue } from "../tenant/tenant.model";
import { PaginationResponse } from "./manager.model";
import { Employee, EmployeeDetails } from "../employee/employee.model";
import { BuildingExpanded } from "../user/user.model";
import { selectIssuesState } from "./manager.selectors";

@Injectable()
export class ManagerEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);
    store = inject(Store);

    private issuesURL = `http://localhost:8080/issues`;
    private buildingsURL = `http://localhost:8080/buildings`;
    private employeesURL = `http://localhost:8080/employees`;

    constructor() { }

    loadIssues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Issue]LoadIssues"]),
            withLatestFrom(this.store.select(selectIssuesState)),
            mergeMap(([_, { currentPage }]) => {
                const nextPage = currentPage + 1;
                const isFirstPage = currentPage === 0;
                return this.http.get<{ issues: Issue[], pagination: PaginationResponse }>(`${this.issuesURL}/all`, {
                    params: {
                        page: nextPage.toString()
                    },
                    withCredentials: true
                }).pipe(
                    map(({ issues, pagination }) => ManagerActions["[Issue]LoadIssuesSuccess"]({ issues, pagination, isFirstPage })),
                    catchError(error => of(ManagerActions["[Issue]LoadIssuesFailure"]({ error })))
                )
            }
            )
        )
    })

    loadAllEmployees$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Employee]LoadAllEmployees"]),
            mergeMap(() => this.http.get<Employee[]>(`${this.employeesURL}`, {
                withCredentials: true
            }).pipe(
                map(employees => ManagerActions["[Employee]LoadAllEmployeesSuccess"]({ employees })),
                catchError(error => of(ManagerActions["[Employee]LoadAllEmployeesFailure"]({ error })))
            ))
        )
    })

    loadEachEmployeeByID$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Employee]LoadEmployeeByID"]),
            mergeMap(({ employeeID }) => this.http.get<EmployeeDetails>(`${this.employeesURL}/${employeeID}`, {
                withCredentials: true
            }).pipe(
                map(employee => ManagerActions["[Employee]LoadEmployeeByIDSuccess"]({ employee })),
                catchError(error => of(ManagerActions["[Employee]LoadEmployeeByIDFailure"]({ error })))
            ))
        )
    })

    addEmployee$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Employee]AddEmployee"]),
            mergeMap(({ employee }) => this.http.post<Employee>(`${this.employeesURL}`, employee, {
                withCredentials: true
            }).pipe(
                map(employee => ManagerActions["[Employee]AddEmployeeSuccess"]({ employee })),
                catchError(error => of(ManagerActions["[Employee]AddEmployeeFailure"]({ error })))
            ))
        )
    })

    updateEmployee$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Employee]UpdateEmployee"]),
            mergeMap(({ employeeID, newEmployee }) => this.http.put<Employee>(`${this.employeesURL}/${employeeID}`, newEmployee, {
                withCredentials: true
            }).pipe(
                map(employee => ManagerActions["[Employee]UpdateEmployeeSuccess"]({ employee })),
                catchError(error => of(ManagerActions["[Employee]UpdateEmployeeFailure"]({ error })))
            ))
        )
    })

    deleteEmployee$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Employee]DeleteEmployee"]),
            mergeMap(({ employeeID }) => this.http.delete<{ employeeID: string }>(`${this.employeesURL}/${employeeID}`, {
                withCredentials: true
            }).pipe(
                map(({ employeeID }) => ManagerActions["[Employee]DeleteEmployeeSuccess"]({ employeeID })),
                catchError(error => of(ManagerActions["[Employee]DeleteEmployeeFailure"]({ error })))
            ))
        )
    })

    loadAllBuildings$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]LoadAllBuildings"]),
            mergeMap(() => this.http.get<BuildingExpanded[]>(`${this.buildingsURL}`, {
                withCredentials: true
            }).pipe(
                map(buildings => ManagerActions["[Building]LoadAllBuildingsSuccess"]({ buildings })),
                catchError(error => of(ManagerActions["[Building]LoadAllBuildingsFailure"]({ error })))
            ))
        )
    })

    reassingEmployeeToBuilding$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]ReassingEmployeeToBuilding"]),
            mergeMap(({ buildingID, employeeID }) => this.http.patch<BuildingExpanded>(`${this.employeesURL}/reassign`, {
                buildingID,
                newEmployeeID: employeeID
            }, {
                withCredentials: true
            }).pipe(
                map(building => ManagerActions["[Building]ReassingEmployeeToBuildingSuccess"]({ building })),
                catchError(error => of(ManagerActions["[Building]ReassingEmployeeToBuildingFailure"]({ error })))
            ))
        )
    })

    updateBuildingName$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]UpdateBuildingName"]),
            mergeMap(({ buildingID, name }) => this.http.put<{ buildingID: string, name: string }>(`${this.buildingsURL}/${buildingID}`, { name }, {
                withCredentials: true
            }).pipe(
                map(({ buildingID, name }) => ManagerActions["[Building]UpdateBuildingNameSuccess"]({ buildingID, name })),
                catchError(error => of(ManagerActions["[Building]UpdateBuildingNameFailure"]({ error })))
            ))
        )
    })

    deleteBuilding$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]DeleteBuilding"]),
            mergeMap(({ buildingID }) => this.http.delete<{ buildingID: string }>(`${this.buildingsURL}/${buildingID}`, {
                withCredentials: true
            }).pipe(
                map(({ buildingID }) => ManagerActions["[Building]DeleteBuildingSuccess"]({ buildingID })),
                catchError(error => of(ManagerActions["[Building]DeleteBuildingFailure"]({ error })))
            ))
        )
    })

    returnInactiveBuildingToActive$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]ReturnInactiveBuildingToActive"]),
            mergeMap(({ buildingID }) => this.http.put<{ buildingID: string }>(`${this.buildingsURL}/${buildingID}/activate`, {}, {
                withCredentials: true
            }).pipe(
                map(({ buildingID }) => ManagerActions["[Building]ReturnInactiveBuildingToActiveSuccess"]({ buildingID })),
                catchError(error => of(ManagerActions["[Building]ReturnInactiveBuildingToActiveFailure"]({ error })))
            ))
        )
    })

    addBuilding$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Building]AddBuilding"]),
            mergeMap(({ name, address, employeeResponsibleId }) => this.http.post<BuildingExpanded>(`${this.buildingsURL}`, { name, address, employeeResponsibleId }, {
                withCredentials: true
            }).pipe(
                map(building => ManagerActions["[Building]AddBuildingSuccess"]({ building })),
                catchError(error => of(ManagerActions["[Building]AddBuildingFailure"]({ error })))
            ))
        )
    })

    setIssueFilter$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Filter]SetIssueFilter"]),
            mergeMap(({ filter }) => {
                const filterParams: Record<string, string | number | boolean | undefined> = {
                    ...filter,
                    dateFrom: filter.dateFrom ? filter.dateFrom.toISOString() : undefined,
                    dateTo: filter.dateTo ? filter.dateTo.toISOString() : undefined,
                };
                let httpParams = new HttpParams();
                Object.entries(filterParams).forEach(([key, value]) => {
                    if (value !== undefined) {
                        httpParams = httpParams.set(key, String(value));
                    }
                });
                return this.http.get<{ issues: Issue[], pagination: PaginationResponse }>(`${this.issuesURL}/filter`, {
                    params: httpParams,
                    withCredentials: true
                }).pipe(
                    map(({ issues, pagination }) => ManagerActions["[Filter]SetIssueFilterSuccess"]({ issues, pagination })),
                    catchError(error => of(ManagerActions["[Filter]SetIssueFilterFailure"]({ error })))
                )
            })
        )
    })

    searchIssues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ManagerActions["[Search]SearchIssues"]),
            mergeMap(({ query }) => {
                return this.http.get<{ issues: Issue[], pagination: PaginationResponse }>(`${this.issuesURL}/search`, {
                    params: {
                        searchTerm: query
                    },
                    withCredentials: true
                }).pipe(
                    map(({ issues, pagination }) => ManagerActions["[Search]SearchIssuesSuccess"]({ issues, pagination })),
                    catchError(error => of(ManagerActions["[Search]SearchIssuesFailure"]({ error })))
                )
            })
        )
    })
}