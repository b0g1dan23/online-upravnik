import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    ParseUUIDPipe,
    HttpException,
    HttpStatus,
    UseGuards,
    ValidationPipe,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesGateway } from './issues.gateway';
import { ViewIssueDTO } from './DTOs/view-issue.dto';
import { Issue } from './issues.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../custom-decorators/CurrentUser';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { CreateIssueDTO } from './DTOs/create-issue.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationType } from 'src/notifications/notifications.entity';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
    constructor(
        private readonly issuesService: IssuesService,
        private readonly issuesGateway: IssuesGateway,
        private readonly employeesService: EmployeesService,
        private readonly notificationsService: NotificationsService,
        private readonly notificationsGateway: NotificationsGateway
    ) { }

    @Get('/user/:userId')
    async getAllIssuesForUser(@Param('userId', ParseUUIDPipe) userId: string) {
        try {
            const issues = await this.issuesService.getAllIssuesForUser(userId);
            return issues.map(issue => this.mapToViewDto(issue));
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Failed to fetch user issues'
            );
        }
    }

    @Post()
    async createIssue(
        @Body(ValidationPipe) createIssueData: CreateIssueDTO,
        @CurrentUser() user: JwtUser
    ): Promise<ViewIssueDTO> {
        try {
            const responsibleEmployee = await this.employeesService.findLeastBusyEmployee();

            const issueData = {
                ...createIssueData,
                user: { id: user.id },
                building: { id: createIssueData.buildingID },
                employeeResponsible: responsibleEmployee
            };

            const newIssue = await this.issuesService.createIssue(issueData);
            const issueDto = this.mapToViewDto(newIssue);

            await this.issuesGateway.notifyUserNewIssue(user.id, issueDto);

            const notification = await this.notificationsService.createIssueNotificationForBuilding(
                NotificationType.ISSUE_CREATED,
                newIssue.id,
                `Nova prijava kvara u vašoj zgradi: ${newIssue.problemDescription}`
            );

            const buildingUserIds = await this.notificationsService.getUsersInSameBuildingAsIssue(newIssue.id);

            for (const userId of buildingUserIds) {
                await this.notificationsGateway.notifyUserNewNotification(userId, notification);
            }

            return issueDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                error.message || 'Failed to create issue'
            );
        }
    }

    @Put('/:issueId')
    async updateIssue(
        @Param('issueId', ParseUUIDPipe) issueId: string,
        @Body() updateData: Partial<Issue>,
        @CurrentUser() user: JwtUser
    ): Promise<ViewIssueDTO> {
        try {
            const existingIssue = await this.issuesService.getIssueById(issueId);
            if (!existingIssue) {
                throw new NotFoundException('Issue not found');
            }

            const updatedIssue = await this.issuesService.updateIssue(issueId, updateData);
            if (!updatedIssue) {
                throw new InternalServerErrorException('Failed to update issue');
            }

            const issueDto = this.mapToViewDto(updatedIssue);

            await this.issuesGateway.notifyUserIssueUpdate(existingIssue.user.id, issueDto);

            const notification = await this.notificationsService.createIssueNotificationForBuilding(
                NotificationType.ISSUE_STATUS_CHANGED,
                issueId,
                `Ažuriran je status prijave kvara: ${updatedIssue.problemDescription}`
            );

            const buildingUserIds = await this.notificationsService.getUsersInSameBuildingAsIssue(issueId);
            for (const userId of buildingUserIds) {
                await this.notificationsGateway.notifyUserNewNotification(userId, notification);
            }

            return issueDto;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to update issue'
            );
        }
    }

    @Get('/:issueId')
    async getIssueById(@Param('issueId', ParseUUIDPipe) issueId: string): Promise<ViewIssueDTO> {
        try {
            const issue = await this.issuesService.getIssueById(issueId);
            if (!issue) {
                throw new NotFoundException('Issue not found');
            }
            return this.mapToViewDto(issue);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to fetch issue'
            );
        }
    }

    @Post('/refresh/:userId')
    async refreshUserIssues(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ message: string }> {
        try {
            await this.issuesGateway.refreshUserIssues(userId);
            return { message: 'User issues refreshed successfully' };
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to refresh user issues'
            );
        }
    }

    private mapToViewDto(issue: Issue): ViewIssueDTO {
        return new ViewIssueDTO(issue);
    }
}
