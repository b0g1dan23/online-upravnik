import { Component, inject, OnInit } from '@angular/core';
import { SingleIssue } from "./single-issue/single-issue";
import { Store } from '@ngrx/store';
import { selectAllIssues } from '../../../store/manager/manager.selectors';
import { AsyncPipe } from '@angular/common';
import { ManagerActions } from '../../../store/manager/manager.actions';

@Component({
  selector: 'app-all-issues',
  imports: [SingleIssue, AsyncPipe],
  templateUrl: './all-issues.html',
})
export class AllIssues implements OnInit {
  private store = inject(Store);
  issues$ = this.store.select(selectAllIssues);

  constructor() { }

  ngOnInit() {
    this.store.dispatch(ManagerActions['[Issue]LoadIssues']());
  }
}
