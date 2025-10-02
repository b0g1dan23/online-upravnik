import { IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { User, UserRoleEnum } from "../users.entity";
import { ViewBuildingBaseDTO } from "src/buildings/DTOs/view-building.dto";

export class ViewUserBaseDTO {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsEnum(UserRoleEnum)
    @IsNotEmpty()
    role: UserRoleEnum;

    @IsUUID()
    @IsNotEmpty()
    buildingLivingInID?: ViewBuildingBaseDTO;

    @IsBoolean()
    isActive: boolean;

    deletedAt: Date | null;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.role = user.role;
        this.buildingLivingInID = user.buildingLivingIn ? new ViewBuildingBaseDTO(user.buildingLivingIn) : undefined;
        this.isActive = user.isActive;
        this.deletedAt = user.deletedAt;
    }
}