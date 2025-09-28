import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TenantActions } from "./tenant.actions";
import { catchError, map, mergeMap, of } from "rxjs";
import { Issue } from "./tenant.model";

@Injectable()
export class TenantEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);
    store = inject(Store);

    private issuesURL = `http://localhost:8080/issues`;

    constructor() { }

    loadIssues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TenantActions["[Tenant]LoadTenantIssues"]),
            mergeMap(() => this.http.get<Issue[]>(`${this.issuesURL}/my`, {
                withCredentials: true
            })
                .pipe(
                    map(issues => TenantActions["[Tenant]LoadTenantIssuesSuccess"]({ issues })),
                    catchError(error => of(TenantActions["[Tenant]LoadTenantIssuesFailure"]({ error })))
                )
            )
        );
    })

    addMyIssue$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TenantActions["[Tenant]CreateTenantIssue"]),
            mergeMap(({ issue: dto }) => this.http.post<Issue>(`${this.issuesURL}`, dto, {
                withCredentials: true
            })
                .pipe(
                    map(issue => TenantActions["[Tenant]CreateTenantIssueSuccess"]({ issue })),
                    catchError(error => of(TenantActions["[Tenant]CreateTenantIssueFailure"]({ error })))
                )
            )
        );
    })

    loadBuildingIssues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TenantActions["[BuildingIssues]LoadBuildingIssues"]),
            mergeMap(() => this.http.get<Issue[]>(`${this.issuesURL}/my/building`, {
                withCredentials: true
            })
                .pipe(
                    map(issues => TenantActions["[BuildingIssues]LoadBuildingIssuesSuccess"]({ issues })),
                    catchError(error => of(TenantActions["[BuildingIssues]LoadBuildingIssuesFailure"]({ error })))
                )
            )
        )
    })
}