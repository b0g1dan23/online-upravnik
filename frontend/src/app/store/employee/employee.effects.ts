import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EmployeeActions } from "./employee.actions";
import { catchError, map, mergeMap, of } from "rxjs";
import { Issue } from "../tenant/tenant.model";

@Injectable()
export class EmployeeEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);
    store = inject(Store);

    private issuesURL = `http://localhost:8080/issues`;

    constructor() { }

    loadBuildingIssues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeeActions["[Issue]LoadAllIssuesForBuilding"]),
            mergeMap(() => this.http.get<Issue[]>(`${this.issuesURL}/employee`, {
                withCredentials: true
            }).pipe(
                map(issues => EmployeeActions["[Issue]LoadAllIssuesForBuildingSuccess"]({ issues })),
                catchError(error => of(EmployeeActions["[Issue]LoadAllIssuesForBuildingFailure"]({ error })))
            ))
        )
    });

    changeIssueStatus$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeeActions["[Issue]ChangeIssueStatus"]),
            mergeMap(({ issueID, newStatus }) => this.http.put<Issue>(`${this.issuesURL}/${issueID}`, { status: newStatus }, {
                withCredentials: true
            }).pipe(
                map(issue => EmployeeActions["[Issue]ChangeIssueStatusSuccess"]({ issue })),
                catchError(error => of(EmployeeActions["[Issue]ChangeIssueStatusFailure"]({ error })))
            ))
        )
    });
}