import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of, switchMap } from 'rxjs';
import { UserActions } from './user.actions';
import { HttpClient } from '@angular/common/http';
import { NestError, User } from './user.model';

@Injectable()
export class UserEffects {
    actions$ = inject(Actions)
    http = inject(HttpClient);

    private authURL = `http://localhost:8080/auth`;
    private usersURL = `http://localhost:8080/users`;

    constructor() { }

    loadUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions['[User]LoadUser']),
            mergeMap(() =>
                this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
                    withCredentials: true
                }).pipe(
                    map(user => UserActions['[User]LoadUserSuccess']({ user })),
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
                    map(user => UserActions['[Auth]LoginSuccess']({ user })),
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
                    map(user => UserActions['[Auth]RegisterSuccess']({ user })),
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
                    map(() => UserActions['[Auth]LogoutSuccess']()),
                )
            )
        );
    });
}
