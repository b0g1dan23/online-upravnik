import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

export const appReducers = {
    user: userReducer
};

export function provideAppStore() {
    return [
        provideStore(appReducers),
        provideEffects([UserEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
            name: 'Online Upravnik App'
        })
    ];
}