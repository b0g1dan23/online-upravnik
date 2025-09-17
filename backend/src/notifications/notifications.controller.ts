import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    HttpException,
    HttpStatus,
    UseGuards,
    ValidationPipe,
    NotFoundException
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notification, NotificationType } from './notifications.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../custom-decorators/CurrentUser';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';

export class CreateNotificationDTO {
    type: NotificationType;
    notificationText: string;
    recipientIds: string[];
    issueId?: string;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly notificationsGateway: NotificationsGateway
    ) { }

    @Get('/user/:userId')
    async getAllNotificationsForUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Notification[]> {
        try {
            const notifications = await this.notificationsService.getAllNotificationsForUser(userId);
            return notifications;
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message || 'Failed to fetch user notifications',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post()
    async createNotification(
        @Body(ValidationPipe) createNotificationData: CreateNotificationDTO,
        @CurrentUser() user: JwtUser
    ): Promise<Notification> {
        try {
            const newNotification = await this.notificationsService.createNotification(createNotificationData);

            for (const recipientId of createNotificationData.recipientIds) {
                await this.notificationsGateway.notifyUserNewNotification(recipientId, newNotification);
            }

            return newNotification;
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message || 'Failed to create notification',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('/:notificationId')
    async getNotificationById(@Param('notificationId', ParseUUIDPipe) notificationId: string): Promise<Notification> {
        try {
            const notification = await this.notificationsService.getNotificationById(notificationId);
            if (!notification) {
                throw new NotFoundException('Notification not found');
            }
            return notification;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to fetch notification',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('/:notificationId')
    async deleteNotification(@Param('notificationId', ParseUUIDPipe) notificationId: string): Promise<{ message: string }> {
        try {
            const existingNotification = await this.notificationsService.getNotificationById(notificationId);
            if (!existingNotification) {
                throw new NotFoundException('Notification not found');
            }

            await this.notificationsService.deleteNotification(notificationId);

            for (const recipient of existingNotification.recipients) {
                await this.notificationsGateway.refreshUserNotifications(recipient.id);
            }

            return { message: 'Notification deleted successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to delete notification',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/refresh/:userId')
    async refreshUserNotifications(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ message: string }> {
        try {
            await this.notificationsGateway.refreshUserNotifications(userId);
            return { message: 'User notifications refreshed successfully' };
        } catch (error) {
            throw new HttpException(
                'Failed to refresh user notifications',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/mark-read/:notificationId')
    async markNotificationAsRead(
        @Param('notificationId', ParseUUIDPipe) notificationId: string,
        @CurrentUser() user: JwtUser
    ): Promise<{ message: string }> {
        try {
            await this.notificationsService.markNotificationAsRead(notificationId, user.id);
            return { message: 'Notification marked as read' };
        } catch (error) {
            throw new HttpException(
                'Failed to mark notification as read',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/broadcast')
    async broadcastNotification(
        @Body(ValidationPipe) notificationData: { type: NotificationType; notificationText: string }
    ): Promise<{ message: string }> {
        try {
            // Broadcast to all connected clients
            this.notificationsGateway.broadcastNotification(notificationData);
            return { message: 'Notification broadcasted successfully' };
        } catch (error) {
            throw new HttpException(
                'Failed to broadcast notification',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
