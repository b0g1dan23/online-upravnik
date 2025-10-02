import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllActiveEmployees, selectAllEmployees, selectAllInactiveEmployees, selectEmployeesError, selectSelectedEmployee } from '../../../store/manager/manager.selectors';
import { ManagerActions } from '../../../store/manager/manager.actions';
import { AsyncPipe } from '@angular/common';
import { SingleEmployee } from './single-employee/single-employee';
import { Modal } from "../../ui/modal/modal";
import { SingleIssue } from "../all-issues/single-issue/single-issue";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { AddEmployee } from "./add-employee/add-employee";
import { SingleBuilding } from "../all-buildings/single-building/single-building";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-all-employees',
  imports: [AsyncPipe, SingleEmployee, Modal, SingleIssue, LucideAngularModule, AddEmployee, SingleBuilding],
  templateUrl: './all-employees.html',
})
export class AllEmployees implements OnInit {
  private store = inject(Store);

  private showModal = new BehaviorSubject(false);
  public showModal$ = this.showModal.asObservable();

  private showAddEmployeeModal = new BehaviorSubject(false);
  public showAddEmployeeModal$ = this.showAddEmployeeModal.asObservable();

  readonly Plus = Plus;
  activeEmployees$ = this.store.select(selectAllActiveEmployees);
  inactiveEmployees$ = this.store.select(selectAllInactiveEmployees);
  selectedEmployee$ = this.store.select(selectSelectedEmployee);
  errors$ = this.store.select(selectEmployeesError);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.store.dispatch(ManagerActions['[Employee]LoadAllEmployees']());

    this.errors$.subscribe(err => {
      if (!err) return;
      this.snackBar.open(err.message);
    });
  }

  showSelectedEmployee = (employeeID: string) => {
    this.store.dispatch(ManagerActions['[Employee]LoadEmployeeByID']({ employeeID }))

    this.showModal.next(true);
  }

  closeSelectedEmployeeModal() {
    this.showModal.next(false);
  }

  closeAddModal() {
    this.showAddEmployeeModal.next(false);
  }

  showAddModal() {
    this.showAddEmployeeModal.next(true);
  }
}
