import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { UserActions } from "./user.actions";

export const initialState: UserState = {
    user: null,
    loading: false,
    error: null
}

export const userReducer = createReducer(
    initialState,
    on(UserActions["[User]LoadUser"], (state) => ({ ...state, loading: true, error: null })),
    on(UserActions["[User]LoadUserSuccess"], (state, { user }) => ({ ...state, user, loading: false })),
    on(UserActions["[User]LoadUserFailure"], (state, { error }) => ({ ...state, error, loading: false })),
    on(UserActions["[Auth]Login"], (state) => ({ ...state, loading: true, error: null })),
    on(UserActions["[Auth]LoginSuccess"], (state, { user }) => ({ ...state, user, loading: false })),
    on(UserActions["[Auth]LoginFailure"], (state, { error }) => ({ ...state, error, loading: false })),
    on(UserActions["[Auth]Register"], (state) => ({ ...state, loading: true, error: null })),
    on(UserActions["[Auth]RegisterSuccess"], (state, { user }) => ({ ...state, user, loading: false })),
    on(UserActions["[Auth]RegisterFailure"], (state, { error }) => ({ ...state, error, loading: false })),
    on(UserActions["[Auth]Logout"], (state) => ({ ...state, loading: true, error: null })),
    on(UserActions["[Auth]LogoutSuccess"], (state) => ({ ...state, user: null, loading: false })),
)