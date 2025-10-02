import { Component, inject, OnInit, signal } from '@angular/core';
import { BuildingsService, BuildingsShorthand } from '../../../services/buildings';
import { Store } from '@ngrx/store';
import { Employee } from '../../../store/employee/employee.model';
import { selectAllEmployees, selectBuildingsError } from '../../../store/manager/manager.selectors';
import { Card } from "../../ui/card/card";
import { ManagerActions } from '../../../store/manager/manager.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestError } from '../../../store/user/user.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-reassign-employee',
  imports: [Card],
  templateUrl: './reassign-employee.html',
})
export class ReassignEmployee implements OnInit {
  private store = inject(Store);
  public buildings: BuildingsShorthand[] = [];
  public employees: Employee[] = [];
  public selectedBuildingID = signal('');
  public selectedEmployeeID = signal('');
  private snackBar = inject(MatSnackBar);
  private reassignError: NestError | null = null;

  constructor(private buildingsService: BuildingsService, private router: Router) { }

  ngOnInit() {
    this.buildingsService
      .getBuildingsList()
      .subscribe(buildings => {
        this.buildings = buildings;
        this.selectedBuildingID.set(this.buildings[0]?.id);
      });

    this.store.select(selectBuildingsError)
      .subscribe(error => {
        if (!error) {
          this.reassignError = null;
          return;
        }
        this.reassignError = error;
        this.snackBar.open(error.message);
      });

    this.store.select(selectAllEmployees)
      .subscribe(employees => {
        this.employees = employees;
        this.selectedEmployeeID.set(this.employees.find(e => e.isActive)?.id || '');
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const state = history.state as { buildingID: string };
        if (state && state.buildingID) {
          this.selectedBuildingID.set(state.buildingID);
        }
      })
  }

  reassignEmployee() {
    this.store.dispatch(ManagerActions['[Building]ReassingEmployeeToBuilding']({
      buildingID: this.selectedBuildingID(),
      employeeID: this.selectedEmployeeID()
    }));
    if (this.reassignError === null)
      this.snackBar.open('Zaposleni je uspešno premešten');
  }
}
