import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginDto, NestError, RegisterDto, User } from "./user.model";

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        '[User] Load User': emptyProps(),
        '[User] Load User Success': props<{ user: User | null }>(),
        '[User] Load User Failure': props<{ error: NestError }>(),

        '[Auth] Login': props<{ dto: LoginDto }>(),
        '[Auth] Login Success': props<{ user: User }>(),
        '[Auth] Login Failure': props<{ error: NestError }>(),

        '[Auth] Register': props<{ dto: RegisterDto }>(),
        '[Auth] Register Success': props<{ user: User }>(),
        '[Auth] Register Failure': props<{ error: NestError }>(),

        '[Auth] Logout': emptyProps(),
        '[Auth] Logout Success': emptyProps(),
    }
})