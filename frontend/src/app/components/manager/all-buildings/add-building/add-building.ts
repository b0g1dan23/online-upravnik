import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import z from 'zod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Button } from "../../../ui/button/button";
import { ReactiveFormsModule } from '@angular/forms';
import { selectAllActiveEmployees, selectBuildingsError } from '../../../../store/manager/manager.selectors';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { ManagerActions } from '../../../../store/manager/manager.actions';
import { Employee } from '../../../../store/employee/employee.model';
import { EventEmitter } from '@angular/core';

export const createBuildingSchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, 'Adresa je obavezna'),
  employeeResponsibleId: z.uuid('Odgovorni zaposleni je obavezan')
})

type CreateBuildingFormValues = z.infer<typeof createBuildingSchema>;

const initialBuildingSchema: CreateBuildingFormValues = {
  name: '',
  address: '',
  employeeResponsibleId: ''
}

@Component({
  selector: 'app-add-building',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './add-building.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBuilding implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<void>();
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  private snackBar = inject(MatSnackBar);
  public building = signal<CreateBuildingFormValues>(initialBuildingSchema);
  public employeesSignal = toSignal(this.store.select(selectAllActiveEmployees), {
    initialValue: [] as Employee[]
  });
  public addErrors$ = this.store.select(selectBuildingsError);

  public activeEmployees = computed(() =>
    this.employeesSignal()
      .filter(emp => emp.isActive)
      .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
  );

  updateField<K extends keyof CreateBuildingFormValues>(field: K, event: Event) {
    const input = event.target as HTMLInputElement;
    this.building.set({
      ...this.building(),
      [field]: input.value as CreateBuildingFormValues[K]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.addErrors$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(err => {
      if (!err) return;
      this.snackBar.open(err.message)
    })

    this.store.select(selectAllActiveEmployees).pipe(
      take(1),
      filter(employees => employees.length === 0)
    ).subscribe(() => {
      this.store.dispatch(ManagerActions['[Employee]LoadAllEmployees']());
    });
  }

  handleSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    const result = createBuildingSchema.safeParse(this.building());
    if (!result.success) {
      if (Array.isArray(JSON.parse(result.error.message))) {
        const messages = JSON.parse(result.error.message);
        this.snackBar.open(messages[0].message);
      } else {
        this.snackBar.open(result.error.message);
      }
      return;
    }

    this.store.dispatch(ManagerActions['[Building]AddBuilding']({ ...result.data }));
    this.addErrors$.subscribe(err => {
      if (!err) {
        this.snackBar.open('Uspesno dodat zaposleni');
        this.resetForm();
        this.closeModal.emit();
        return;
      }
      console.log(err);
    });
  }

  private resetForm() {
    this.building.set(initialBuildingSchema);
  }
}
