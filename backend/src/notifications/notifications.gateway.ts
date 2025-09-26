import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

interface ClientInfo {
    userId?: string;
    socket: WebSocket;
}

@Injectable()
@WebSocketGateway({ path: '/notifications' })
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients: Map<WebSocket, ClientInfo> = new Map();

    constructor(private notificationsService: NotificationsService) { }

    afterInit(server: Server) {
        console.log('✅ WS server initialized on /notifications');
    }

    handleConnection(client: WebSocket) {
        this.clients.set(client, { socket: client });

        client.on('message', async (msg: string) => {
            try {
                const { event, data } = JSON.parse(msg);

                if (event === 'subscribe_user_notifications') {
                    const clientInfo = this.clients.get(client);
                    if (clientInfo) {
                        clientInfo.userId = data.userId;
                        this.clients.set(client, clientInfo);
                    }

                    const userNotifications = await this.notificationsService.getAllNotificationsForUser(data.userId);
                    client.send(
                        JSON.stringify({ event: 'USER_NOTIFICATIONS_LIST', data: userNotifications }),
                    );
                }

                if (event === 'unsubscribe_user_notifications') {
                    const clientInfo = this.clients.get(client);
                    if (clientInfo) {
                        clientInfo.userId = undefined;
                        this.clients.set(client, clientInfo);
                    }
                }

                if (event === 'mark_notification_read') {
                    await this.notificationsService.markNotificationAsRead(data.notificationId, data.userId);

                    const clientInfo = this.clients.get(client);
                    if (clientInfo && clientInfo.userId) {
                        client.send(JSON.stringify({
                            event: 'NOTIFICATION_MARKED_READ',
                            data: { notificationId: data.notificationId }
                        }));
                    }
                }
            } catch (err) {
                client.send(JSON.stringify({ event: 'ERROR', data: 'Invalid message' }));
            }
        });
    }

    handleDisconnect(client: WebSocket) {
        console.log('🔔 Notification client disconnected');
        this.clients.delete(client);
    }

    async notifyUserNewNotification(userId: string, notification: any) {
        let notifiedClients = 0;
        this.clients.forEach((clientInfo, socket) => {
            if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                console.log(`✅ Sending new notification to client`);
                clientInfo.socket.send(
                    JSON.stringify({ event: 'USER_NEW_NOTIFICATION', data: notification }),
                );
                notifiedClients++;
            }
        });
    }

    async notifyUserNotificationUpdate(userId: string, notification: any) {
        this.clients.forEach((clientInfo) => {
            if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                console.log(`✅ Sending notification update to client`);
                clientInfo.socket.send(
                    JSON.stringify({ event: 'USER_NOTIFICATION_UPDATED', data: notification }),
                );
            }
        });
    }

    async refreshUserNotifications(userId: string) {
        try {
            const userNotifications = await this.notificationsService.getAllNotificationsForUser(userId);

            this.clients.forEach((clientInfo) => {
                if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                    clientInfo.socket.send(
                        JSON.stringify({ event: 'USER_NOTIFICATIONS_LIST', data: userNotifications }),
                    );
                }
            });
        } catch (error) {
            console.error('Error refreshing user notifications:', error);
        }
    }

    broadcastNotification(notification: any) {
        this.server.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({ event: 'BROADCAST_NOTIFICATION', data: notification }));
            }
        });
    }
}