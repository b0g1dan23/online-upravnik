import { Component, inject } from '@angular/core';
import { TenantAllIssues } from "../../components/tenant/tenant-all-issues/tenant-all-issues";
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tenant',
  imports: [TenantAllIssues, AsyncPipe],
  templateUrl: './tenant.html',
})
export class Tenant {
  private store = inject(Store);
  user$ = this.store.select(selectUser)
}
