import { Component, inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Card } from "../../../ui/card/card";
import { Building, BuildingExpanded } from '../../../../store/user/user.model';
import { AsyncPipe, NgClass } from '@angular/common';
import { Button } from "../../../ui/button/button";
import { Router } from '@angular/router';
import { BehaviorSubject, filter, map, Subject, takeUntil } from 'rxjs';
import { Modal } from "../../../ui/modal/modal";
import { LucideAngularModule, Pencil, Trash } from 'lucide-angular';
import { IssueStatusEnum } from '../../../../store/tenant/tenant.model';
import { Store } from '@ngrx/store';
import { ManagerActions } from '../../../../store/manager/manager.actions';
import { selectAllBuildings } from '../../../../store/manager/manager.selectors';

@Component({
  selector: 'app-single-building',
  imports: [Card, NgClass, Button, AsyncPipe, Modal, LucideAngularModule],
  templateUrl: './single-building.html',
})
export class SingleBuilding implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) building!: BuildingExpanded | Building;
  @Input({ required: false }) removable: boolean = false;
  @Input({ required: false }) editable: boolean = false;
  @Input({ required: false }) isInactive: boolean = false;
  private store = inject(Store);
  private showModal = new BehaviorSubject(false);
  public showModal$ = this.showModal.asObservable();
  public readonly Pencil = Pencil;
  public readonly Trash = Trash;
  private selectAllBuildings$ = this.store.select(selectAllBuildings);
  private destroy$ = new Subject<void>();
  public unResolvedIssuesCount = 0;

  constructor(readonly router: Router) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    if (this.isExpandedBuilding()) {
      this.unResolvedIssuesCount = this.building.issues.filter(issue => issue.currentStatus.status !== IssueStatusEnum.RESOLVED).length;
    }
  }

  ngOnInit(): void {
    if (this.isExpandedBuilding()) {
      this.selectAllBuildings$.pipe(
        map(buildings => buildings.find(b => b.id === this.building.id)),
        filter((b): b is BuildingExpanded => b !== undefined),
        takeUntil(this.destroy$)
      ).subscribe(updatedBuilding => {
        this.building = updatedBuilding;
        this.unResolvedIssuesCount = this.building.issues.filter(issue => issue.currentStatus.status !== IssueStatusEnum.RESOLVED).length;
      })
    }
  }

  navigateToReassign() {
    this.router.navigateByUrl(`/manager/employees#reassign-employee`, { state: { buildingID: this.building.id } });
  }

  returnToActive() {
    this.store.dispatch(ManagerActions['[Building]ReturnInactiveBuildingToActive']({ buildingID: this.building.id }));
  }

  isExpandedBuilding(): this is { building: BuildingExpanded } {
    return (this.building as BuildingExpanded).employeeResponsible !== undefined && (this.building as BuildingExpanded).issues !== undefined && (this.building as BuildingExpanded).residents !== undefined;
  }

  showEditNameModal() {
    this.showModal.next(true);
  }

  closeEditNameModal() {
    this.showModal.next(false);
  }

  deleteBuilding() {
    this.store.dispatch(ManagerActions['[Building]DeleteBuilding']({ buildingID: this.building.id }));
    this.closeEditNameModal();
  }
}
