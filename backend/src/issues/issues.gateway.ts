import { Injectable } from "@nestjs/common";
import { Server, WebSocket } from 'ws';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UsersService } from "src/users/users.service";
import { IssuesService } from "./issues.service";
import { ViewIssueCurrentStatusDTO, ViewIssueDTO } from "./DTOs/view-issue.dto";
import { EmployeesService } from "src/employees/employees.service";
import { UserRoleEnum } from "src/users/users.entity";

interface ClientInfo {
    userID?: string;
    buildingID?: string;
    userRole?: UserRoleEnum;
    socket: WebSocket;
}

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, path: '/issues' })
export class IssuesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private clients: Map<WebSocket, ClientInfo> = new Map();

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly userService: UsersService,
        private readonly employeesService: EmployeesService,
        private readonly issuesService: IssuesService) { }

    handleDisconnect(client: WebSocket) {
        this.clients.delete(client);
    }

    handleConnection(client: WebSocket) {
        this.clients.set(client, { socket: client });

        client.on('message', async (msg: string) => {
            try {
                const { event, data } = JSON.parse(msg);

                if (event === 'subscribe_building_issues') {
                    await this.handleSubscribeBuildingIssues(client, data.userID);
                }
                if (event === 'subscribe_employee_issues') {
                    await this.handleSubscribeEmployeeIssues(client, data.userID);
                }
                if (event === 'subscribe_manager_issues') {
                    await this.handleSubscribeManagerIssues(client, data.userID);
                }
                if (event === 'unsubscribe') {
                    this.clients.delete(client);
                }
            } catch (err) {
                console.error('Error processing message:', err);
            }
        })
    }

    afterInit() {
        console.log("WS Initialized on /issues");
    }

    private async handleSubscribeEmployeeIssues(client: WebSocket, employeeID: string) {
        try {
            const employee = await this.employeesService.findEmployeeById(employeeID);

            const clientInfo = this.clients.get(client);
            if (clientInfo) {
                clientInfo.userID = employeeID;
                clientInfo.buildingID = undefined;
                clientInfo.userRole = UserRoleEnum.EMPLOYEE;
                this.clients.set(client, clientInfo);
            }

            client.send(JSON.stringify({
                event: "SUCCESSFULLY_SUBSCRIBED_EMPLOYEE",
                data: { employeeID: employee.id }
            }));
        } catch (err) {
            client.send(JSON.stringify({ event: 'ERROR', data: 'Failed to subscribe employee' }));
        }
    }

    private async handleSubscribeManagerIssues(client: WebSocket, userID: string) {
        try {
            const user = await this.userService.findUserByID(userID);

            if (user.role !== UserRoleEnum.MANAGER) {
                client.send(JSON.stringify({
                    event: 'ERROR',
                    data: "User is not a manager"
                }))
                return;
            }

            const clientInfo = this.clients.get(client);
            if (clientInfo) {
                clientInfo.userID = userID;
                clientInfo.buildingID = undefined;
                clientInfo.userRole = UserRoleEnum.EMPLOYEE;
                this.clients.set(client, clientInfo);
            }

            client.send(JSON.stringify({
                event: 'SUCCESSFULLY_SUBSCRIBED_MANAGER',
                data: "Subscribed to manager issue notifications"
            }))
        } catch (error) {
            client.send(JSON.stringify({ event: 'ERROR', data: 'Failed to subscribe manager' }));
        }
    }

    private async handleSubscribeBuildingIssues(client: WebSocket, userID: string) {
        try {
            const user = await this.userService.findUserByID(userID);

            if (!user.buildingLivingInID) {
                client.send(JSON.stringify({
                    event: 'ERROR',
                    data: "User is not associated with any building"
                }))
                return;
            }

            const clientInfo = this.clients.get(client);
            if (clientInfo) {
                clientInfo.userID = userID;
                clientInfo.buildingID = user.buildingLivingInID.id;
                clientInfo.userRole = UserRoleEnum.TENANT;
                this.clients.set(client, clientInfo);
            }

            client.send(JSON.stringify({
                event: 'SUCCESSFULLY_SUBSCRIBED_BUILDING',
                data: {
                    buildingID: user.buildingLivingInID.id,
                }
            }))
        } catch (error) {
            client.send(JSON.stringify({ event: 'ERROR', data: 'Failed to subscribe' }));
        }
    }

    async notifyBuildingNewIssue(buildingID: string, issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'BUILDING_NEW_ISSUE',
            data: issue
        })

        this.clients.forEach((clientInfo) => {
            if (clientInfo.buildingID === buildingID &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            };
        });
    }

    async notifyBuildingIssueUpdate(buildingID: string, issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'BUILDING_ISSUE_UPDATE',
            data: issue
        })

        this.clients.forEach((clientInfo) => {
            if (clientInfo.buildingID === buildingID &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            }
        })
    }

    async notifyUserIssueUpdate(userID: string, issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'USER_ISSUE_UPDATE',
            data: issue
        })

        this.clients.forEach((clientInfo) => {
            if (clientInfo.userID === userID &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            }
        })
    }

    async notifySpecificEmployeeNewIssue(issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'SPECIFIC_EMPLOYEE_NEW_ISSUE',
            data: issue
        })

        this.clients.forEach((clientInfo) => {
            if (clientInfo.userID === issue.employeeResponsible.id &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            }
        })
    }

    async notifyAllManagersNewIssue(issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'MANAGER_NEW_ISSUE',
            data: issue
        })

        this.clients.forEach((clientInfo) => {
            if (clientInfo.userRole === UserRoleEnum.MANAGER &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            }
        })
    }

    async notifyAllManagersIssueStatusChange(issue: ViewIssueCurrentStatusDTO) {
        const message = JSON.stringify({
            event: 'MANAGER_ISSUE_STATUS_CHANGED',
            data: issue
        });

        this.clients.forEach((clientInfo) => {
            if (clientInfo.userRole === UserRoleEnum.MANAGER &&
                clientInfo.socket.readyState === WebSocket.OPEN) {
                clientInfo.socket.send(message);
            }
        });
    }
}