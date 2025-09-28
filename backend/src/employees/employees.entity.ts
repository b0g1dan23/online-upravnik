import { Building } from "src/buildings/buildings.entity";
import { Issue } from "src/issues/issues.entity";
import { User, UserRoleEnum } from "src/users/users.entity"
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Employee extends User {
    constructor() {
        super();
        this.role = UserRoleEnum.EMPLOYEE;
    }

    @Column()
    position: string;

    @OneToMany(() => Building, building => building.employeeResponsible)
    buildings: Building[]

    @OneToMany(() => Issue, issue => issue.employeeResponsible, { eager: true })
    issuesAssigned: Issue[];
}