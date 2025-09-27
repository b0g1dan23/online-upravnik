import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notifications.entity';
import { User } from '../users/users.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getAllNotificationsForUser(userId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { recipients: { id: userId } },
            relations: [
                'issue',
                'issue.user',
                'issue.building',
                'recipients'
            ],
            order: { createdAt: 'DESC' }
        });
    }

    async createNotification(notificationData: {
        type: NotificationType;
        notificationText: string;
        recipientIds: string[];
        issueId?: string;
    }): Promise<Notification> {
        const notification = this.notificationRepository.create({
            type: notificationData.type,
            notificationText: notificationData.notificationText,
            issue: notificationData.issueId ? { id: notificationData.issueId } as any : undefined,
            recipients: notificationData.recipientIds.map(id => ({ id } as any))
        });

        return this.notificationRepository.save(notification);
    }

    async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
        // TODO: Optionally, verify that the userId is among the recipients of the notification
    }

    async getNotificationById(notificationId: string): Promise<Notification | null> {
        return this.notificationRepository.findOne({
            where: { id: notificationId },
            relations: [
                'issue',
                'issue.user',
                'issue.building',
                'recipients'
            ]
        });
    }

    async deleteNotification(notificationId: string): Promise<void> {
        await this.notificationRepository.delete(notificationId);
    }

    // Helper method to create issue-related notifications
    async createIssueNotification(
        type: NotificationType,
        issueId: string,
        recipientIds: string[],
        customText?: string
    ): Promise<Notification> {
        const defaultTexts = {
            [NotificationType.ISSUE_CREATED]: 'New issue has been created',
            [NotificationType.ISSUE_ASSIGNED]: 'Issue has been assigned to you',
            [NotificationType.ISSUE_STATUS_CHANGED]: 'Issue status has been updated',
            [NotificationType.ISSUE_PICTURE_ADDED]: 'New picture added to issue',
            [NotificationType.ISSUE_COMPLETED]: 'Issue has been completed',
        };

        return this.createNotification({
            type,
            notificationText: customText || defaultTexts[type] || 'Issue notification',
            recipientIds,
            issueId
        });
    }

    async getUsersInSameBuildingAsIssue(issueId: string): Promise<string[]> {
        const result = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.buildingLivingIn', 'building')
            .innerJoin('building.issues', 'issue', 'issue.id = :issueId', { issueId })
            .select('user.id')
            .getMany();

        return result.map(user => user.id);
    }

    async createIssueNotificationForBuilding(
        type: NotificationType,
        issueId: string,
        customText?: string
    ): Promise<Notification> {
        const buildingUserIds = await this.getUsersInSameBuildingAsIssue(issueId);

        return this.createIssueNotification(type, issueId, buildingUserIds, customText);
    }
}
