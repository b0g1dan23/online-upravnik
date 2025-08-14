import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Issue, IssueStatus, IssuePicture } from './issues.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, IssueStatus, IssuePicture])],
  providers: [IssuesService],
  controllers: [IssuesController],
  exports: [IssuesService]
})
export class IssuesModule { }
