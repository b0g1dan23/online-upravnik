import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDTO {
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

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsUUID()
    @IsNotEmpty()
    buildingLivingInID: string;
}