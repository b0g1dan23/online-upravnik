import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Issue, IssueStatusEnum } from '../../../../store/tenant/tenant.model';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Card } from "../../../ui/card/card";
import { Button } from "../../../ui/button/button";
import { Store } from '@ngrx/store';
import { EmployeeActions } from '../../../../store/employee/employee.actions';
import { BehaviorSubject } from 'rxjs';
import { Modal } from "../../../ui/modal/modal";
import { ChangeStatus } from "../../../employee/change-status/change-status";
import { CdkObserveContent } from "@angular/cdk/observers";

@Component({
  selector: 'app-single-issue',
  imports: [DatePipe, Card, NgClass, Button, AsyncPipe, Modal, ChangeStatus, CdkObserveContent],
  templateUrl: './single-issue.html',
})
export class SingleIssue {
  @Input({ required: true }) public issue!: Issue;
  @Input({ required: false }) public canLoadDetails = false;
  @Input({ required: false }) public canChangeStatus = false;
  @Output() showIssueDetails = new EventEmitter<string>();
  showChangeModal$ = new BehaviorSubject(false);

  private store = inject(Store);

  constructor() { }

  showDetails() {
    if (this.canLoadDetails) {
      this.showIssueDetails.emit(this.issue.id);
    }
  }

  markAsResolved() {
    if (this.canChangeStatus) {
      this.store.dispatch(EmployeeActions['[Issue]ChangeIssueStatus']({ issueID: this.issue.id, newStatus: IssueStatusEnum.RESOLVED }));
    }
  }

  toggleChangeModal() {
    this.showChangeModal$.next(!this.showChangeModal$.value);
  }
}
