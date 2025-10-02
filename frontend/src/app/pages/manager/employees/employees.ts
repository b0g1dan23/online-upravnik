import { Component } from '@angular/core';
import { AllEmployees } from "../../../components/manager/all-employees/all-employees";
import { ReassignEmployee } from '../../../components/manager/reassign-employee/reassign-employee';

@Component({
  selector: 'app-employees',
  imports: [AllEmployees, ReassignEmployee],
  templateUrl: './employees.html',
})
export class Employees {
}
