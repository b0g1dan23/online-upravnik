import { NestError, User } from "./user.model";

export interface UserState {
    user: User | null;
    loading: boolean;
    error: NestError | null;
    webSocket: {
        connected: boolean;
        connecting: boolean;
        error: any | null;
    };
}