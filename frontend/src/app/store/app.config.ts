import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';
import { TenantEffects } from './tenant/tenant.effects';
import { tenantReducer } from './tenant/tenant.reducer';
import { managerReducer } from './manager/manager.reducer';
import { employeeReducer } from './employee/employee.reducer';
import { EmployeeEffects } from './employee/employee.effects';
import { ManagerEffects } from './manager/manager.effects';

export const appReducers = {
    user: userReducer,
    tenant: tenantReducer,
    manager: managerReducer,
    employee: employeeReducer
};

export function provideAppStore() {
    return [
        provideStore(appReducers),
        provideEffects([UserEffects, TenantEffects, ManagerEffects, EmployeeEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
            name: 'Online Upravnik App'
        })
    ];
}