import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { IssuesGateway } from './issues.gateway';
import { Issue, IssueStatus, IssuePicture } from './issues.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, IssueStatus, IssuePicture]),
    EmployeesModule,
    NotificationsModule,
    UsersModule
  ],
  providers: [IssuesService, IssuesGateway],
  controllers: [IssuesController],
  exports: [IssuesService, IssuesGateway]
})
export class IssuesModule { }
