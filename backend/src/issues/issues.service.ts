import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './issues.entity';
import { CreateIssueDTO } from './DTOs/create-issue.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/employees.entity';

@Injectable()
export class IssuesService {
    constructor(
        @InjectRepository(Issue)
        private issueRepository: Repository<Issue>
    ) { }

    async getAllIssuesForUser(userId: string): Promise<Issue[]> {
        return this.issueRepository.find({
            where: { user: { id: userId } },
            relations: [
                'user',
                'building',
                'employeeResponsible',
                'statusHistory',
                'statusHistory.changedBy',
                'pictures',
                'pictures.uploadedBy',
                'notifications'
            ],
            order: { createdAt: 'DESC' }
        });
    }

    async createIssue(issueData: CreateIssueDTO & { user: { id: string }, employeeResponsible: Employee }): Promise<Issue> {
        const issue = this.issueRepository.create(issueData);
        return this.issueRepository.save(issue);
    }

    async updateIssue(issueId: string, updateData: Partial<Issue>): Promise<Issue | null> {
        await this.issueRepository.update(issueId, updateData);
        return this.issueRepository.findOne({
            where: { id: issueId },
            relations: [
                'user',
                'building',
                'employeeResponsible',
                'statusHistory',
                'statusHistory.changedBy',
                'pictures',
                'pictures.uploadedBy',
                'notifications'
            ]
        });
    }

    async getIssueById(issueId: string): Promise<Issue | null> {
        return this.issueRepository.findOne({
            where: { id: issueId },
            relations: [
                'user',
                'building',
                'employeeResponsible',
                'statusHistory',
                'statusHistory.changedBy',
                'pictures',
                'pictures.uploadedBy',
                'notifications'
            ]
        });
    }
}
