import { Component, inject, OnInit } from '@angular/core';
import { SingleIssue } from "./single-issue/single-issue";
import { Store } from '@ngrx/store';
import { selectAllIssues, selectSelectedIssue } from '../../../store/manager/manager.selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ManagerActions } from '../../../store/manager/manager.actions';
import { BehaviorSubject } from 'rxjs';
import { Modal } from "../../ui/modal/modal";

@Component({
  selector: 'app-all-issues',
  imports: [SingleIssue, AsyncPipe, Modal, DatePipe],
  templateUrl: './all-issues.html',
})
export class AllIssues implements OnInit {
  private store = inject(Store);
  private showModal$ = new BehaviorSubject(false);
  public showModal = this.showModal$.asObservable();
  issues$ = this.store.select(selectAllIssues);
  selectedIssue$ = this.store.select(selectSelectedIssue);

  constructor() { }

  ngOnInit() {
    this.store.dispatch(ManagerActions['[Issue]LoadIssues']());
  }

  showIssueDetails(issueID: string) {
    this.store.dispatch(ManagerActions['[Issue]LoadIssueByID']({ issueID }));
    this.toggleModal();
  }

  toggleModal() {
    this.showModal$.next(!this.showModal$.value);
  }
}
