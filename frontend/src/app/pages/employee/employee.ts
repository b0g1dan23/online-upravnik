import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { AsyncPipe } from '@angular/common';
import { EmployeeIssues } from "../../components/employee/employee-issues/employee-issues";

@Component({
  selector: 'app-employee',
  imports: [AsyncPipe, EmployeeIssues],
  templateUrl: './employee.html',
})
export class Employee {
  private store = inject(Store);
  user$ = this.store.select(selectUser);

  constructor() { }
}
