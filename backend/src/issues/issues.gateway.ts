import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { ViewIssueDTO } from './DTOs/view-issue.dto';

interface ClientInfo {
    userId?: string;
    socket: WebSocket;
}

@Injectable()
@WebSocketGateway({ path: '/issues' })
export class IssuesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients: Map<WebSocket, ClientInfo> = new Map();

    constructor(private issuesService: IssuesService) { }

    afterInit(server: Server) {
        console.log('✅ WS server initialized on /issues');
    }

    handleConnection(client: WebSocket) {
        console.log('Client connected');
        this.clients.set(client, { socket: client });

        client.on('message', async (msg: string) => {
            try {
                console.log(`📨 Received message: ${msg}`);
                const { event, data } = JSON.parse(msg);

                if (event === 'subscribe_user_issues') {
                    console.log(`🔔 Subscribing user ${data.userId} to their issues`);
                    const clientInfo = this.clients.get(client);
                    if (clientInfo) {
                        clientInfo.userId = data.userId;
                        this.clients.set(client, clientInfo);
                        console.log(`✅ User ${data.userId} subscribed successfully`);
                    }

                    const userIssues = (await this.issuesService.getAllIssuesForUser(
                        data.userId,
                    )).map(issue => new ViewIssueDTO(issue));
                    client.send(
                        JSON.stringify({ event: 'USER_ISSUES_LIST', data: userIssues }),
                    );
                    console.log(`📤 Sent ${userIssues.length} issues to user ${data.userId}`);
                }

                if (event === 'unsubscribe_user_issues') {
                    console.log(`🔕 Unsubscribing client from user issues`);
                    const clientInfo = this.clients.get(client);
                    if (clientInfo) {
                        clientInfo.userId = undefined;
                        this.clients.set(client, clientInfo);
                    }
                }
            } catch (err) {
                console.error('❌ WS error parsing message', err);
                client.send(JSON.stringify({ event: 'ERROR', data: 'Invalid message' }));
            }
        });
    }

    handleDisconnect(client: WebSocket) {
        console.log('Client disconnected');
        this.clients.delete(client);
    }

    async notifyUserIssueUpdate(userId: string, issue: any) {
        console.log(`Notifying user ${userId} about issue update`);

        this.clients.forEach((clientInfo) => {
            if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                clientInfo.socket.send(
                    JSON.stringify({ event: 'USER_ISSUE_UPDATED', data: issue }),
                );
            }
        });
    }

    async notifyUserNewIssue(userId: string, issue: any) {
        console.log(`🔔 Attempting to notify user ${userId} about new issue`);
        console.log(`📊 Total connected clients: ${this.clients.size}`);

        let notifiedClients = 0;
        this.clients.forEach((clientInfo, socket) => {
            console.log(`👤 Client userId: ${clientInfo.userId}, target userId: ${userId}`);
            console.log(`🔌 Client readyState: ${clientInfo.socket.readyState}`);

            if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                console.log(`✅ Sending notification to client`);
                clientInfo.socket.send(
                    JSON.stringify({ event: 'USER_NEW_ISSUE', data: issue }),
                );
                notifiedClients++;
            }
        });

        console.log(`📤 Notified ${notifiedClients} clients for user ${userId}`);
    }

    async refreshUserIssues(userId: string) {
        console.log(`Refreshing issues for ${userId}`);

        try {
            const userIssues = await this.issuesService.getAllIssuesForUser(userId);

            this.clients.forEach((clientInfo) => {
                if (clientInfo.userId === userId && clientInfo.socket.readyState === 1) {
                    clientInfo.socket.send(
                        JSON.stringify({ event: 'USER_ISSUES_LIST', data: userIssues }),
                    );
                }
            });
        } catch (error) {
            console.error('Error refreshing user issues:', error);
        }
    }

    notifyNewTicket(ticket: any) {
        console.log('Broadcasting new ticket');
        this.server.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({ event: 'NEW_TICKET', data: ticket }));
            }
        });
    }
}
