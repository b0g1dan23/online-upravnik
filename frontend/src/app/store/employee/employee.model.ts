import { Issue } from "../tenant/tenant.model";
import { Building, RegisterDto, User } from "../user/user.model";

export interface Employee extends Omit<User, 'buildingLivingIn'> {
    position: string;
}

export interface EmployeeDetails extends Employee {
    issuesAssigned: Issue[];
    buildings: Building[];
}

export interface CreateEmployeeDTO extends Omit<RegisterDto, 'buildingLivingInID'> {
    position: string;
}