import { CreateUserDTO } from "src/users/DTOs/create-user.dto";
import { OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEmployeeDTO extends OmitType(CreateUserDTO, ['buildingLivingInID'] as const) {
    @IsString()
    @IsNotEmpty()
    position: string;
}