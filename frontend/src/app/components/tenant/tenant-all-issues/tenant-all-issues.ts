import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBuildingIssues, selectMyIssues } from '../../../store/tenant/tenant.selectors';
import { AsyncPipe } from '@angular/common';
import { SingleIssue } from "../../manager/all-issues/single-issue/single-issue";
import { TenantActions } from '../../../store/tenant/tenant.actions';
import { Button } from "../../ui/button/button";
import { BehaviorSubject } from 'rxjs';
import { Modal } from "../../ui/modal/modal";
import { AddIssue } from "../add-issue/add-issue";

@Component({
  selector: 'app-tenant-all-issues',
  imports: [AsyncPipe, SingleIssue, Button, Modal, AddIssue],
  templateUrl: './tenant-all-issues.html',
})
export class TenantAllIssues implements OnInit {
  private store = inject(Store);
  myIssues$ = this.store.select(selectMyIssues);
  buildingIssues$ = this.store.select(selectBuildingIssues);
  showAddModal$ = new BehaviorSubject(false);

  ngOnInit(): void {
    this.store.dispatch(TenantActions['[Tenant]LoadTenantIssues']());
    this.store.dispatch(TenantActions['[BuildingIssues]LoadBuildingIssues']());
  }

  toggleAddModal() {
    this.showAddModal$.next(!this.showAddModal$.value);
  }
}
