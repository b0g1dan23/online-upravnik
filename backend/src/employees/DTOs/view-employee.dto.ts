import { ViewUserBaseDTO } from "src/users/DTOs/view-user-base.dto";
import { Employee } from "../employees.entity";

export class ViewEmployeeDTO extends ViewUserBaseDTO {
    position: string;

    constructor(employee: Employee) {
        super(employee);
        this.position = employee.position;
    }
}