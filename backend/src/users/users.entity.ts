import { Building } from "src/buildings/buildings.entity";
import { Issue, IssuePicture } from "src/issues/issues.entity";
import argon from 'argon2';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRoleEnum {
    MANAGER = 'MANAGER',
    TENANT = 'TENANT',
    EMPLOYEE = 'EMPLOYEE'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.TENANT })
    role: UserRoleEnum;

    @Column({ length: 30 })
    phoneNumber: string;

    @Column({ length: 100 })
    password: string;

    @OneToMany(() => Issue, issue => issue.user)
    issues: Issue[];

    @ManyToOne(() => Building, building => building.residents, { nullable: true })
    @JoinColumn({ name: 'buildingId' })
    buildingLivingIn?: Building;

    @OneToMany(() => IssuePicture, picture => picture.uploadedBy)
    issuePictures: IssuePicture[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashingPassword() {
        if (this.password)
            this.password = await argon.hash(this.password);
    }
}
