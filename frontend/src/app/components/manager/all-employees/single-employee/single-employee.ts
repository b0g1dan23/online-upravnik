import { Component, inject, Input } from '@angular/core';
import { Employee } from '../../../../store/employee/employee.model';
import { Card } from "../../../ui/card/card";
import { Button } from "../../../ui/button/button";
import { LucideAngularModule, Pencil, Trash } from "lucide-angular";
import { Store } from '@ngrx/store';
import { ManagerActions } from '../../../../store/manager/manager.actions';

@Component({
  selector: 'app-single-employee',
  imports: [Card, Button, LucideAngularModule],
  templateUrl: './single-employee.html',
})
export class SingleEmployee {
  @Input({ required: true }) employee!: Employee;
  @Input({ required: true }) showSelectedEmployee: (employeeID: string) => void = () => { };
  readonly Trash = Trash;
  readonly Pencil = Pencil;
  private store = inject(Store);

  deleteEmployee() {
    this.store.dispatch(ManagerActions['[Employee]DeleteEmployee']({ employeeID: this.employee.id }));
  }
}
