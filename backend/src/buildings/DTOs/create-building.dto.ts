import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";


export class CreateBuildingDTO {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsUUID()
    @IsNotEmpty()
    employeeResponsibleId: string;
}