import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { AsyncPipe } from '@angular/common';
import { AllIssues } from "../../components/manager/all-issues/all-issues";

@Component({
  selector: 'app-manager',
  imports: [AsyncPipe, AllIssues],
  templateUrl: './manager.html',
})
export class Manager {
  private store = inject(Store);
  public manager$ = this.store.select(selectUser);
}
