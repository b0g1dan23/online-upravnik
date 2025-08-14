import { Building } from "src/buildings/buildings.entity";
import { Issue, IssuePicture } from "src/issues/issues.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ length: 30 })
    phoneNumber: string;

    @Column({ length: 100 })
    hashPassword: string;

    @OneToMany(() => Issue, issue => issue.user)
    issues: Issue[];

    @ManyToOne(() => Building, building => building.residents)
    @JoinColumn({ name: 'buildingId' })
    buildingLivingIn: Building;

    @OneToMany(() => IssuePicture, picture => picture.uploadedBy)
    issuePictures: IssuePicture[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
