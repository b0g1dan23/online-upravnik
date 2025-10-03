import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EmployeeActions } from '../../../store/employee/employee.actions';
import { selectBuildingIssuesForEmployee } from '../../../store/employee/employee.selectors';
import { AsyncPipe } from '@angular/common';
import { SingleIssue } from "../../manager/all-issues/single-issue/single-issue";

@Component({
  selector: 'app-employee-issues',
  imports: [AsyncPipe, SingleIssue],
  templateUrl: './employee-issues.html',
})
export class EmployeeIssues implements OnInit {
  private store = inject(Store);
  issues$ = this.store.select(selectBuildingIssuesForEmployee);

  constructor() { }

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions['[Issue]LoadAllIssuesForBuilding']());
  }
}
