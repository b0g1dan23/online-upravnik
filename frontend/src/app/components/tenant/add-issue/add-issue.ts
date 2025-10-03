import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Button } from "../../ui/button/button";
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import z from 'zod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectTenantError } from '../../../store/tenant/tenant.selectors';
import { TenantActions } from '../../../store/tenant/tenant.actions';

const basicTextAreaSchema = z.object({
  issueDescription: z.string()
    .min(10, 'Opis kvara mora imati najmanje 10 karaktera')
    .max(1000, 'Opis kvara ne sme biti duzi od 1000 karaktera')
})

@Component({
  selector: 'app-add-issue',
  imports: [Button, AsyncPipe],
  templateUrl: './add-issue.html',
})
export class AddIssue implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<void>();
  issueDescription$ = new BehaviorSubject('');
  snackBar = inject(MatSnackBar);
  private store = inject(Store);
  private destroy$ = new BehaviorSubject<void>(undefined);
  public additionError$ = this.store.select(selectTenantError);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.additionError$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        this.snackBar.open(error.message);
      }
    });
  }

  handleSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    const result = basicTextAreaSchema.safeParse({ issueDescription: this.issueDescription$.value });
    if (!result.success) {
      if (Array.isArray(JSON.parse(result.error.message))) {
        const first = JSON.parse(result.error.message)[0];
        if (first.message)
          this.snackBar.open(first.message);
        else
          this.snackBar.open("Doslo je do greske prilikom validacije, pokusajte ponovo");
      } else {
        this.snackBar.open(result.error.message);
      }
      return;
    }

    this.store.dispatch(TenantActions['[Tenant]CreateTenantIssue']({ issue: { problemDescription: this.issueDescription$.value } }));
    this.snackBar.open("Kvar je uspešno prijavljen. Hvala vam što ste nas obavestili.");
    this.resetTextArea();
  }

  private resetTextArea() {
    this.issueDescription$.next('');
    this.closeModal.emit();
  }
}
