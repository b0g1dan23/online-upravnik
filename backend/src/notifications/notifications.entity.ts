import { Issue } from "src/issues/issues.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum NotificationType {
    ISSUE_CREATED = 'ISSUE_CREATED',
    ISSUE_ASSIGNED = 'ISSUE_ASSIGNED',
    ISSUE_STATUS_CHANGED = 'ISSUE_STATUS_CHANGED',
    ISSUE_PICTURE_ADDED = 'ISSUE_PICTURE_ADDED',
    ISSUE_COMPLETED = 'ISSUE_COMPLETED',

    EMPLOYEE_ASSIGNED = 'EMPLOYEE_ASSIGNED',
    EMPLOYEE_UNASSIGNED = 'EMPLOYEE_UNASSIGNED',

    BUILDING_ANNOUNCEMENT = 'BUILDING_ANNOUNCEMENT',
    MANAGER_MESSAGE = 'MANAGER_MESSAGE',

    GENERAL_INFO = 'GENERAL_INFO'
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Issue, issue => issue.notifications)
    @JoinColumn({ name: 'issueId' })
    issue: Issue;

    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @Column()
    notificationText: string;

    @ManyToMany(() => User)
    @JoinTable()
    recipients: User[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}