import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { IssueStatusEnum } from "../issues.entity";

export class PaginationDTO {
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 24;
}

export class FilterIssueDTO extends PaginationDTO {
    @IsOptional()
    @IsEnum(IssueStatusEnum)
    status?: IssueStatusEnum;

    @IsOptional()
    @IsUUID(4, { message: 'buildingID must be a valid UUID v4' })
    buildingID?: string;

    @IsOptional()
    @IsUUID(4, { message: 'employeeID must be a valid UUID v4' })
    employeeID?: string;

    @IsOptional()
    @IsUUID(4, { message: 'userID must be a valid UUID v4' })
    userID?: string;

    @IsOptional()
    @IsDateString()
    dateFrom?: Date;

    @IsOptional()
    @IsDateString()
    dateTo?: Date;
}

export class SearchIssueDTO extends PaginationDTO {
    @IsString()
    searchTerm: string;
}