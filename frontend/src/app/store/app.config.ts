import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';
import { TenantEffects } from './tenant/tenant.effects';
import { tenantReducer } from './tenant/tenant.reducer';

export const appReducers = {
    user: userReducer,
    tenant: tenantReducer
};

export function provideAppStore() {
    return [
        provideStore(appReducers),
        provideEffects([UserEffects, TenantEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
            name: 'Online Upravnik App'
        })
    ];
}