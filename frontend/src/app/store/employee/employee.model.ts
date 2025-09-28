import { RegisterDto, User } from "../user/user.model";

export interface Employee extends User {
    position: string;
}

export interface CreateEmployeeDTO extends Omit<RegisterDto, 'buildingLivingInID'> {
    position: string;
}