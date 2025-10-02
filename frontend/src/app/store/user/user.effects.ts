import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of, switchMap, takeUntil, filter, take, tap } from 'rxjs';
import { UserActions } from './user.actions';
import { HttpClient } from '@angular/common/http';
import { User, UserRoleEnum } from './user.model';
import { Issue } from '../tenant/tenant.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TenantActions } from '../tenant/tenant.actions';
import { Store } from '@ngrx/store';
import { selectUser } from './user.selectors';
import { Router } from '@angular/router';
import { EmployeeActions } from '../employee/employee.actions';
import { ManagerActions } from '../manager/manager.actions';

export interface BackendWebSocketMessage {
    event: 'BUILDING_NEW_ISSUE' | 'BUILDING_ISSUE_UPDATE' | 'USER_ISSUE_UPDATE' |
    'SUCCESSFULLY_SUBSCRIBED_BUILDING' | 'SUCCESSFULLY_SUBSCRIBED_EMPLOYEE' | 'SUCCESSFULLY_SUBSCRIBED_MANAGER' |
    'SPECIFIC_EMPLOYEE_NEW_ISSUE' | 'MANAGER_NEW_ISSUE' | 'MANAGER_ISSUE_STATUS_CHANGED' | 'ERROR';
    data: Issue | { message: string } | string;
}

export interface FrontendWebSocketMessage {
    event: 'subscribe_building_issues' | 'subscribe_employee_issues' | 'subscribe_manager_issues' | 'unsubscribe';
    data: { userID: string };
}

@Injectable()
export class UserEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);
    store = inject(Store);
    router = inject(Router);

    private authURL = `http://localhost:8080/auth`;
    private usersURL = `http://localhost:8080/users`;
    private wsIssuesURL = `ws://localhost:8080/issues`;

    private currentUser: User | null = null;

    constructor() {
        this.store.select(selectUser).subscribe(user => {
            this.currentUser = user;
        });
    }

    loadUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[User]LoadUser']),
            mergeMap(() =>
                this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
                    withCredentials: true
                }).pipe(
                    map(user => {
                        if (user)
                            this.store.dispatch(UserActions['[IssueWebSocket]Initialize']());
                        return UserActions['[User]LoadUserSuccess']({ user });
                    }),
                    tap(({ user }) => {
                        if (user) {
                            switch (user.role) {
                                case UserRoleEnum.EMPLOYEE:
                                    this.router.navigateByUrl('/employee');
                                    break;
                                case UserRoleEnum.MANAGER:
                                    this.router.navigateByUrl('/manager');
                                    break;
                                default:
                                    this.router.navigateByUrl('/tenant');
                            }
                        }
                    }),
                    catchError((err) => {
                        if (err.statusCode === 401) {
                            return of(UserActions['[User]LoadUserSuccess']({ user: null }));
                        }
                        return of(UserActions['[User]LoadUserFailure']({ error: err }));
                    })
                )
            )
        );
    });

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[Auth]Login']),
            mergeMap(({ dto }) =>
                this.http.post<any>(`${this.authURL}/login`, dto, {
                    withCredentials: true
                }).pipe(
                    switchMap(() =>
                        this.http.get<User>(`${this.usersURL}/from-cookie`, {
                            withCredentials: true
                        })
                    ),
                    map(user => {
                        this.store.dispatch(UserActions['[IssueWebSocket]Initialize']());
                        return UserActions['[Auth]LoginSuccess']({ user });
                    }),
                    tap(({ user }) => {
                        if (user) {
                            switch (user.role) {
                                case UserRoleEnum.EMPLOYEE:
                                    this.router.navigateByUrl('/employee');
                                    break;
                                case UserRoleEnum.MANAGER:
                                    this.router.navigateByUrl('/manager');
                                    break;
                                default:
                                    this.router.navigateByUrl('/tenant');
                            }
                        }
                    }),
                    catchError(error => of(UserActions['[Auth]LoginFailure']({ error })))
                )
            )
        );
    });

    register$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[Auth]Register']),
            mergeMap(({ dto }) =>
                this.http.post<any>(`${this.authURL}/register`, dto, {
                    withCredentials: true
                }).pipe(
                    switchMap(() =>
                        this.http.get<User>(`${this.usersURL}/from-cookie`, {
                            withCredentials: true
                        })
                    ),
                    map(user => {
                        this.store.dispatch(UserActions['[IssueWebSocket]Initialize']());
                        return UserActions['[Auth]RegisterSuccess']({ user });
                    }),
                    catchError(error => of(UserActions['[Auth]RegisterFailure']({ error })))
                )
            )
        );
    });

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[Auth]Logout']),
            mergeMap(() =>
                this.http.post(`${this.authURL}/logout`, {}, {
                    withCredentials: true
                }).pipe(
                    map(() => {
                        this.store.dispatch(UserActions['[IssueWebSocket]Disconnect']());
                        return UserActions['[Auth]LogoutSuccess']();
                    }),
                    tap(() => {
                        this.router.navigateByUrl('/login');
                    })
                )
            )
        );
    });

    initializeIssueWebSocket$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[IssueWebSocket]Initialize']),
            mergeMap(() => {
                const websocket$ = webSocket<BackendWebSocketMessage>({
                    url: this.wsIssuesURL,
                    openObserver: {
                        next: () => {
                            this.store.dispatch(UserActions["[IssueWebSocket]Connected"]());
                            this.subscribeToBuilding(websocket$);
                        }
                    },
                    closeObserver: {
                        next: () => {
                            this.store.dispatch(UserActions["[IssueWebSocket]Disconnected"]());
                        }
                    }
                });
                return websocket$.pipe(
                    map(message => this.handleIssueWebSocketMessage(message)),
                    catchError(error => {
                        return of(UserActions["[IssueWebSocket]Error"]({ error }));
                    }),
                    takeUntil(this.actions$.pipe(
                        ofType(UserActions["[IssueWebSocket]Disconnect"])
                    )));
            })
        )
    })

    disconnectIssueWebSocket$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions["[IssueWebSocket]Disconnect"]),
            map(() => {
                this.store.dispatch(UserActions["[IssueWebSocket]Disconnected"]());
            })
        );
    }, { dispatch: false })

    private subscribeToBuilding(websocket$: any) {
        this.store.select(selectUser).pipe(
            filter(user => user !== null),
            take(1)
        ).subscribe(user => {
            if (user) {
                const subscribeMessage: FrontendWebSocketMessage = {
                    event: user.role === UserRoleEnum.EMPLOYEE ? 'subscribe_employee_issues' : user.role === UserRoleEnum.MANAGER ? 'subscribe_manager_issues' : 'subscribe_building_issues',
                    data: { userID: user.id }
                };
                websocket$.next(subscribeMessage);
                return;
            }
        });
    }

    private handleIssueWebSocketMessage(message: BackendWebSocketMessage) {
        switch (message.event) {
            case 'SUCCESSFULLY_SUBSCRIBED_BUILDING':
            case 'SUCCESSFULLY_SUBSCRIBED_EMPLOYEE':
            case 'SUCCESSFULLY_SUBSCRIBED_MANAGER':
                return UserActions["[IssueWebSocket]SubscribedSuccessfully"]({
                    data: message.data as { message: string }
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
                return TenantActions['[MyIssues]IssueUpdated']({
                    issue: message.data as Issue
                });
            case 'SPECIFIC_EMPLOYEE_NEW_ISSUE':
                return EmployeeActions['[IssueWebSocket]NewIssueAssigned']({
                    issue: message.data as Issue
                })

            case 'MANAGER_NEW_ISSUE':
                return ManagerActions['[IssueWebSocket]NewIssueAdded']({
                    issue: message.data as Issue
                });
            case 'MANAGER_ISSUE_STATUS_CHANGED':
                return ManagerActions['[IssueWebSocket]IssueUpdated']({
                    issue: message.data as Issue
                });

            case 'ERROR':
            default:
                return UserActions["[IssueWebSocket]UnknownMessage"]({ message });
        }
    }

}
