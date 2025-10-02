import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ManagerActions } from '../../../store/manager/manager.actions';
import { selectAllActiveBuildings, selectAllInactiveBuildings } from '../../../store/manager/manager.selectors';
import { AsyncPipe } from '@angular/common';
import { SingleBuilding } from "./single-building/single-building";
import { Button } from "../../ui/button/button";
import { Building, LucideAngularModule } from 'lucide-angular';
import { BehaviorSubject } from 'rxjs';
import { Modal } from '../../ui/modal/modal';
import { AddBuilding } from "./add-building/add-building";

@Component({
  selector: 'app-all-buildings',
  imports: [AsyncPipe, SingleBuilding, Button, LucideAngularModule, Modal, AddBuilding],
  templateUrl: './all-buildings.html',
})
export class AllBuildings implements OnInit {
  private store = inject(Store);
  readonly Building = Building;
  public activeBuildings$ = this.store.select(selectAllActiveBuildings);
  public inactiveBuildings$ = this.store.select(selectAllInactiveBuildings);
  private showAddModal$ = new BehaviorSubject(false);
  public showAddModal = this.showAddModal$.asObservable();

  constructor() { }

  ngOnInit(): void {
    this.store.dispatch(ManagerActions['[Building]LoadAllBuildings']());
  }

  toggleAddBuildingModal() {
    this.showAddModal$.next(!this.showAddModal$.value);
  }
}
