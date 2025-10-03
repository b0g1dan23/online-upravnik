import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    ParseUUIDPipe,
    UseGuards,
    ValidationPipe,
    InternalServerErrorException,
    NotFoundException,
    Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesGateway } from './issues.gateway';
import { ViewIssueCurrentStatusDTO, ViewIssueDTO } from './DTOs/view-issue.dto';
import { Issue } from './issues.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../custom-decorators/CurrentUser';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { CreateIssueDTO, MinimalInfoIssueDTO, UpdateIssueStatusDTO } from './DTOs/create-issue.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationType } from 'src/notifications/notifications.entity';
import { UsersService } from 'src/users/users.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/custom-decorators/Roles';
import { UserRoleEnum } from 'src/users/users.entity';
import { FilterIssueDTO, SearchIssueDTO } from './DTOs/filter-search.dto';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
    constructor(
        private readonly issuesService: IssuesService,
        private readonly issuesGateway: IssuesGateway,
        private readonly usersService: UsersService,
        private readonly employeesService: EmployeesService,
        private readonly notificationsService: NotificationsService,
        private readonly notificationsGateway: NotificationsGateway
    ) { }

    @Get('/my')
    async getAllIssuesForUser(@CurrentUser() user: JwtUser) {
        try {
            const issues = await this.issuesService.getAllIssuesForUser(user.id);
            return issues.map(issue => this.mapToCurrentStatusDto(issue));
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Failed to fetch user issues'
            );
        }
    }

    @Get('/my/building')
    async getAllIssuesForUserBuilding(@CurrentUser() user: JwtUser) {
        const existingUser = await this.usersService.findUserByID(user.id);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        if (!existingUser.buildingLivingIn) {
            throw new NotFoundException('User is not associated with any building');
        }

        const issues = await this.issuesService.getIssuesByBuilding(existingUser.buildingLivingIn.id);
        return issues.map(issue => this.mapToCurrentStatusDto(issue));
    }

    @Get('/employee')
    @UseGuards(RolesGuard)
    @Roles(UserRoleEnum.EMPLOYEE)
    async getAllIssuesForEmployee(@CurrentUser() user: JwtUser) {
        try {
            const employee = await this.employeesService.findEmployeeById(user.id, {
                issuesAssigned: {
                    user: true,
                    building: true,
                    employeeResponsible: true,
                    statusHistory: {
                        changedBy: true
                    }
                }
            });
            return employee.issuesAssigned.map(this.mapToCurrentStatusDto);
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(
                error.message || 'Failed to fetch employee issues'
            );
        }
    }

    @Get('/all')
    @UseGuards(RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    async getAllIssuesForManager(@Query('page') page: number = 1, @Query('limit') limit: number = 24) {
        const result = await this.issuesService.getAllIssues(page, limit);

        return {
            issues: result.issues.map(issue => this.mapToCurrentStatusDto(issue)),
            pagination: {
                page,
                limit,
                totalCount: result.totalCount,
                totalPages: Math.ceil(result.totalCount / limit)
            }
        };
    }

    @Post()
    async createIssue(
        @Body(ValidationPipe) minimalInfoAboutIssue: MinimalInfoIssueDTO,
        @CurrentUser() user: JwtUser
    ) {
        try {
            const [existingUser, responsibleEmployee] = await Promise.all([
                this.usersService.findUserByID(user.id),
                this.employeesService.findLeastBusyEmployee()
            ]);
            if (!existingUser)
                throw new NotFoundException('User not found');
            if (!existingUser.buildingLivingIn) {
                throw new NotFoundException('User is not associated with any building');
            }

            const issueData = new CreateIssueDTO(
                existingUser,
                existingUser.buildingLivingIn,
                responsibleEmployee,
                minimalInfoAboutIssue.problemDescription
            );

            const newIssue = await this.issuesService.createIssue(issueData);
            const issueDto = this.mapToCurrentStatusDto(newIssue);

            Promise.all([
                this.issuesGateway.notifyBuildingNewIssue(
                    existingUser.buildingLivingIn.id,
                    issueDto
                ),
                this.issuesGateway.notifySpecificEmployeeNewIssue(issueDto),
                this.issuesGateway.notifyAllManagersNewIssue(issueDto)
            ]);

            const [notification, buildingUserIds] = await Promise.all([
                this.notificationsService.createIssueNotificationForBuilding(
                    NotificationType.ISSUE_CREATED,
                    newIssue.id,
                    `Nova prijava kvara u vašoj zgradi: ${newIssue.problemDescription}`
                ),
                this.notificationsService.getUsersInSameBuildingAsIssue(newIssue.id)
            ]);

            const notificationPromises = buildingUserIds.map(userId =>
                this.notificationsGateway.notifyUserNewNotification(userId, notification)
            );

            await Promise.allSettled(notificationPromises).catch(error =>
                console.error('WebSocket notification error:', error)
            );

            return issueDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                error.message || 'Failed to create issue'
            );
        }
    }

    @UseGuards(RolesGuard)
    @Roles(UserRoleEnum.EMPLOYEE)
    @Put('/:issueId')
    async updateIssue(
        @Param('issueId', ParseUUIDPipe) issueId: string,
        @Body() updateBody: UpdateIssueStatusDTO,
        @CurrentUser() user: JwtUser
    ) {
        try {
            const updatedIssue = await this.issuesService.updateIssueStatus(issueId, user.id, updateBody.status);
            const issueDto = this.mapToCurrentStatusDto(updatedIssue);

            Promise.all([
                this.issuesGateway.notifyBuildingIssueUpdate(
                    updatedIssue.building.id,
                    issueDto
                ),
                this.issuesGateway.notifyAllManagersIssueStatusChange(issueDto)
            ]);
            // const [notification, buildingUserIds] = await Promise.all([
            //     this.notificationsService.createIssueNotificationForBuilding(
            //         NotificationType.ISSUE_STATUS_CHANGED,
            //         issueId,
            //         `Ažuriran je status prijave kvara: ${updatedIssue.problemDescription}`
            //     ),
            //     this.notificationsService.getUsersInSameBuildingAsIssue(issueId)
            // ]);

            // const notificationPromises = [
            //     this.issuesGateway.notifyUserIssueUpdate(updatedIssue.user.id, issueDto),
            //     ...buildingUserIds.map(userId =>
            //         this.notificationsGateway.notifyUserNewNotification(userId, notification)
            //     )
            // ];

            // await Promise.allSettled(notificationPromises).catch(error =>
            //     console.error('WebSocket notification error:', error)
            // );

            return issueDto;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
                'Failed to update issue'
            );
        }
    }

    @UseGuards(RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Get('/filter')
    async filterIssues(@Query() filterDto: FilterIssueDTO) {
        const filteredIssues = await this.issuesService.filterIssues(filterDto);
        return {
            issues: filteredIssues.issues.map(issue => this.mapToCurrentStatusDto(issue)),
            pagination: {
                page: filterDto.page!,
                limit: filterDto.limit!,
                totalCount: filteredIssues.totalCount,
                totalPages: Math.ceil(filteredIssues.totalCount / filterDto.limit!)
            }
        }
    }

    @UseGuards(RolesGuard)
    @Roles(UserRoleEnum.MANAGER)
    @Get('/search')
    async searchIssues(@Query() searchDto: SearchIssueDTO) {
        const searchResults = await this.issuesService.searchIssues(searchDto);
        return {
            issues: searchResults.issues.map(issue => this.mapToCurrentStatusDto(issue)),
            pagination: {
                page: searchDto.page!,
                limit: searchDto.limit!,
                totalCount: searchResults.totalCount,
                totalPages: Math.ceil(searchResults.totalCount / searchDto.limit!)
            }
        };
    }

    @Get('/:issueId')
    async getIssueById(@Param('issueId', ParseUUIDPipe) issueId: string): Promise<ViewIssueDTO> {
        const issue = await this.issuesService.getIssueById(issueId);
        return this.mapToViewDto(issue);
    }

    private mapToViewDto(issue: Issue): ViewIssueDTO {
        return new ViewIssueDTO(issue);
    }

    private mapToCurrentStatusDto(issue: Issue): ViewIssueCurrentStatusDTO {
        return new ViewIssueCurrentStatusDTO(issue);
    }
}
