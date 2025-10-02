import type { Employee } from "src/employees/employees.entity";
import { Issue } from "src/issues/issues.entity";
import { User } from "src/users/users.entity";
import { AfterUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Building {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    address: string;

    @Column({ length: 100, nullable: true })
    name?: string;

    @OneToMany(() => Issue, issue => issue.building)
    issues: Issue[];

    @OneToMany(() => User, (user) => user.buildingLivingIn, { eager: true })
    residents: User[];

    @ManyToOne("Employee", (employee: Employee) => employee.buildings, { eager: true })
    @JoinColumn({ name: 'employeeResponsibleId' })
    employeeResponsible: Employee;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}