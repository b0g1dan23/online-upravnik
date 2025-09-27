import { Building } from "src/buildings/buildings.entity";
import type { Employee } from "src/employees/employees.entity";
import { Notification } from "src/notifications/notifications.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum IssueStatusEnum {
    REPORTED = 'REPORTED',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CANCELLED = 'CANCELLED'
}

export enum IssuePictureType {
    PROBLEM = 'PROBLEM',
    SOLUTION = 'SOLUTION'
}

@Entity()
export class Issue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    problemDescription: string;

    @ManyToOne(() => User, user => user.issues)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Building, (building: Building) => building.issues)
    @JoinColumn({ name: 'buildingId' })
    building: Building;

    @ManyToOne("Employee", (employee: Employee) => employee.issuesAssigned)
    @JoinColumn({ name: 'employeeResponsibleId' })
    employeeResponsible: Employee;

    @OneToMany(() => IssueStatus, status => status.issue, { cascade: true })
    statusHistory: IssueStatus[];

    @OneToMany(() => IssuePicture, picture => picture.issue, { cascade: true })
    pictures: IssuePicture[];

    @OneToMany(() => Notification, notification => notification.issue, { cascade: true, eager: true })
    notifications: Notification[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

@Entity()
export class IssueStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: IssueStatusEnum, default: IssueStatusEnum.REPORTED })
    status: IssueStatusEnum;

    @ManyToOne("Issue", "statusHistory", { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'issueId' })
    issue: Issue;

    @ManyToOne("Employee", { nullable: true })
    @JoinColumn({ name: 'changedByEmployeeId' })
    changedBy?: Employee;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

@Entity()
export class IssuePicture {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filePath: string;

    @Column({ type: 'enum', enum: IssuePictureType })
    type: IssuePictureType;

    @ManyToOne(() => User, user => user.issuePictures)
    @JoinColumn({ name: 'uploadedById' })
    uploadedBy: User;

    @ManyToOne(() => Issue, issue => issue.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'issueId' })
    issue: Issue;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

