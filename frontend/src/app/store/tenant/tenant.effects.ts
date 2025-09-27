import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TenantActions } from "./tenant.actions";
import { catchError, filter, map, mergeMap, of, take, takeUntil } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { Issue } from "./tenant.model";
import { selectUser } from "../user/user.selectors";

export interface BackendWebSocketMessage {
    event: 'BUILDING_NEW_ISSUE' | 'BUILDING_ISSUE_UPDATE' | 'USER_ISSUE_UPDATE' | "SUCCESSFULLY_SUBSCRIBED_BUILDING";
    data: Issue | { buildingID: string } | string;
}

@Injectable()
export class TenantEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);
    store = inject(Store);

    private issuesURL = `http://localhost:8080/issues`;
    private webSocketURL = `ws://localhost:8080/ws/issues`;

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

    initializeWebSocket$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TenantActions["[WebSocket]Initialize"]),
            mergeMap(() => {
                const websocket$ = webSocket<BackendWebSocketMessage>({
                    url: this.webSocketURL,
                    openObserver: {
                        next: () => {
                            this.store.dispatch(TenantActions["[WebSocket]Connected"]());
                            this.subscribeToBuilding(websocket$);
                        }
                    },
                    closeObserver: {
                        next: () => {
                            this.store.dispatch(TenantActions["[WebSocket]Disconnected"]());
                        }
                    }
                });
                return websocket$.pipe(map(message => this.handleWebSocketMessage(message)),
                    catchError(error => {
                        return of(TenantActions["[WebSocket]Error"]({ error }));
                    }),
                    takeUntil(this.actions$.pipe(
                        ofType(TenantActions["[WebSocket]Disconnect"])
                    )));
            })
        )
    })

    disconnectWebSocket$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TenantActions["[WebSocket]Disconnect"]),
            map(() => {
                this.store.dispatch(TenantActions["[WebSocket]Disconnected"]());
            })
        );
    }, { dispatch: false })

    private subscribeToBuilding(websocket$: any) {
        this.store.select(selectUser).pipe(
            filter(user => user !== null),
            take(1)
        ).subscribe(user => {
            if (user) {
                const subscribeMessage = {
                    event: 'subscribe_building_issues',
                    data: { userID: user.id }
                };

                websocket$.next(subscribeMessage);
            }
        });
    }

    private handleWebSocketMessage(message: BackendWebSocketMessage) {
        switch (message.event) {
            case 'SUCCESSFULLY_SUBSCRIBED_BUILDING':
                return TenantActions["[WebSocket]SubscribedSuccessfully"]({
                    data: message.data as { buildingID: string }
                });

            case 'BUILDING_NEW_ISSUE':
                return TenantActions["[BuildingIssues]NewIssueAdded"]({
                    issue: message.data as Issue
                });

            case 'BUILDING_ISSUE_UPDATE':
                return TenantActions["[BuildingIssues]IssueUpdated"]({
                    issue: message.data as Issue
                });

            case 'USER_ISSUE_UPDATE':
                return TenantActions["[MyIssues]IssueUpdated"]({
                    issue: message.data as Issue
                });

            default:
                return TenantActions["[WebSocket]UnknownMessage"]({ message });
        }
    }
}