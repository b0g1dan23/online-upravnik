import { Building } from "src/buildings/buildings.entity";
import { Issue } from "src/issues/issues.entity";
import { User } from "src/users/users.entity"
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Employee extends User {
    @Column()
    position: string;

    @OneToMany(() => Building, building => building.employeeResponsible)
    buildings: Building[]

    @OneToMany(() => Issue, issue => issue.employeeResponsible)
    issuesAssigned: Issue[];
}