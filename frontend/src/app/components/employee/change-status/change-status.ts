import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IssueStatusEnum } from '../../../store/tenant/tenant.model';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { EmployeeActions } from '../../../store/employee/employee.actions';

@Component({
  selector: 'app-change-status',
  imports: [NgClass],
  templateUrl: './change-status.html',
})
export class ChangeStatus {
  @Input({ required: true }) currentStatus!: IssueStatusEnum;
  @Input({ required: true }) issueID!: string;
  @Output() closeModal = new EventEmitter<void>();
  statusOptions = Object.values(IssueStatusEnum);
  private store = inject(Store);

  changeStatus(newStatus: IssueStatusEnum) {
    this.store.dispatch(EmployeeActions['[Issue]ChangeIssueStatus']({ issueID: this.issueID, newStatus }))
    this.closeModal.emit();
  }
}
