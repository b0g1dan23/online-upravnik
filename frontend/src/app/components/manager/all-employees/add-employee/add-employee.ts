import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CreateEmployeeDTO } from "../../../../store/employee/employee.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import { z } from 'zod';
import { Store } from '@ngrx/store';
import { ManagerActions } from '../../../../store/manager/manager.actions';
import { selectEmployeesError } from '../../../../store/manager/manager.selectors';

const validateCreateEmployeeSchema = z.object({
  firstName: z.string().min(1, 'Ime je obavezno'),
  lastName: z.string().min(1, 'Prezime je obavezno'),
  email: z.email('Email nije validan'),
  phoneNumber: z.string().min(1, 'Broj telefona je obavezan'),
  password: z.string().min(6, 'Sifra mora imati najmanje 6 karaktera')
    .regex(/[A-Z]/, 'Sifra mora sadrzati bar jedno veliko slovo')
    .regex(/[a-z]/, 'Sifra mora sadrzati bar jedno malo slovo')
    .regex(/[0-9]/, 'Sifra mora sadrzati bar jedan broj')
    .regex(/[^A-Za-z0-9]/, 'Sifra mora sadrzati bar jedan specijalni karakter'),
  position: z.string().min(1, 'Pozicija je obavezna'),
})

const initialEmployeeState: CreateEmployeeDTO = {
  firstName: '',
  lastName: '',
  position: '',
  email: '',
  phoneNumber: '',
  password: ''
}

@Component({
  selector: 'app-add-employee',
  imports: [],
  templateUrl: './add-employee.html',
})
export class AddEmployee implements OnInit {
  private store = inject(Store);
  employee = signal<CreateEmployeeDTO>(initialEmployeeState);
  snackBar = inject(MatSnackBar);
  addErrors$ = this.store.select(selectEmployeesError);

  @Output() closeModal = new EventEmitter<void>();

  ngOnInit(): void {
    this.addErrors$.subscribe(err => {
      if (!err) return;
      this.snackBar.open(err.message);
    });
  }

  updateField<K extends keyof CreateEmployeeDTO>(field: K, event: Event) {
    const input = event.target as HTMLInputElement;
    this.employee.set({
      ...this.employee(),
      [field]: input.value as CreateEmployeeDTO[K]
    });
  }

  handleSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    const result = validateCreateEmployeeSchema.safeParse(this.employee());
    if (!result.success) {
      if (Array.isArray(JSON.parse(result.error.message))) {
        const messages = JSON.parse(result.error.message);
        this.snackBar.open(messages[0].message);
      } else {
        this.snackBar.open(result.error.message);
      }
      return;
    }

    this.store.dispatch(ManagerActions['[Employee]AddEmployee']({ employee: this.employee() }));
    this.addErrors$.subscribe(err => {
      if (!err) {
        this.snackBar.open('Uspesno dodat zaposleni');
        this.resetForm();
        this.closeModal.emit();
      }
    });
  }

  private resetForm() {
    this.employee.set(initialEmployeeState);
  }
}
