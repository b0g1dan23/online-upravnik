import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Issue, IssueStatus, IssueStatusEnum } from './issues.entity';
import { CreateIssueDTO } from './DTOs/create-issue.dto';
import { ViewIssueCurrentStatusDTO } from './DTOs/view-issue.dto';

@Injectable()
export class IssuesService {
    constructor(
        @InjectRepository(Issue)
        private issueRepository: Repository<Issue>,
        private dataSource: DataSource
    ) { }

    async getAllIssuesForUser(userId: string): Promise<Issue[]> {
        return this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .leftJoinAndSelect('status.changedBy', 'statusChanger')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'pictureUploader')
            .where('issue.user.id = :userId', { userId })
            .orderBy('issue.createdAt', 'DESC')
            .addOrderBy('status.createdAt', 'DESC')
            .getMany();
    }

    async getAllIssues() {
        return this.issueRepository.find({
            relations: {
                user: true,
                building: true,
                employeeResponsible: true,
                statusHistory: {
                    changedBy: true
                },
                pictures: {
                    uploadedBy: true
                }
            }
        })
    }

    async createIssue(issueData: CreateIssueDTO): Promise<Issue> {
        return await this.dataSource.transaction(async manager => {
            const issue = manager.create(Issue, issueData);
            const savedIssue = await manager.save(issue);

            const initialStatus = manager.create(IssueStatus, {
                issue: savedIssue
            });
            await manager.save(initialStatus);

            const issueWithRelations = await this.getIssueWithAllRelations(savedIssue.id, manager);
            if (!issueWithRelations) {
                throw new InternalServerErrorException('Issue creation failed');
            }

            return issueWithRelations;
        })
    }

    async updateIssueStatus(issueId: string, updatedStatus: IssueStatusEnum) {
        return await this.dataSource.transaction(async manager => {
            const issue = await manager
                .createQueryBuilder(Issue, 'issue')
                .leftJoinAndSelect('issue.statusHistory', 'status')
                .leftJoinAndSelect('status.changedBy', 'changedBy')
                .where('issue.id = :issueId', { issueId })
                .orderBy('status.createdAt', 'DESC')
                .getOne();

            if (!issue) {
                throw new NotFoundException('Issue not found');
            }

            const currentStatus = issue.statusHistory && issue.statusHistory.length > 0 ? issue.statusHistory[0].status : null;

            if (currentStatus && currentStatus === updatedStatus) {
                const updatedIssue = await this.getIssueWithAllRelations(issueId, manager);
                if (!updatedIssue) {
                    throw new InternalServerErrorException('Issue update failed');
                }
                return updatedIssue;
            }
            const newStatus = manager.create(IssueStatus, {
                issue: issue,
                status: updatedStatus
            });
            await manager.save(newStatus);

            const updatedIssue = await this.getIssueWithAllRelations(issueId, manager);
            if (!updatedIssue) {
                throw new InternalServerErrorException('Issue update failed');
            }
            return updatedIssue;
        })
    }

    async getIssueById(issueId: string) {
        const existingIssue = await this.getIssueWithAllRelations(issueId);
        if (!existingIssue) {
            throw new NotFoundException('Issue not found');
        }
        return existingIssue;
    }

    private async getIssueWithAllRelations(issueId: string, manager?: EntityManager): Promise<Issue | null> {
        if (manager) {
            return await manager
                .createQueryBuilder(Issue, 'issue')
                .leftJoinAndSelect('issue.user', 'user')
                .leftJoinAndSelect('issue.building', 'building')
                .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
                .leftJoinAndSelect('issue.statusHistory', 'status')
                .leftJoinAndSelect('status.changedBy', 'statusChangedBy')
                .leftJoinAndSelect('issue.pictures', 'pictures')
                .leftJoinAndSelect('pictures.uploadedBy', 'picturesUploadedBy')
                .where('issue.id = :issueId', { issueId })
                .orderBy('status.createdAt', 'DESC')
                .getOne();
        }
        return await this.dataSource
            .createQueryBuilder(Issue, 'issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .leftJoinAndSelect('status.changedBy', 'statusChangedBy')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'picturesUploadedBy')
            .where('issue.id = :issueId', { issueId })
            .orderBy('status.createdAt', 'DESC')
            .getOne();
    }

    async getIssuesByBuilding(buildingId: string): Promise<Issue[]> {
        return this.issueRepository.find({
            where: { building: { id: buildingId } },
            relations: {
                user: true,
                building: true,
                employeeResponsible: true,
                statusHistory: {
                    changedBy: true
                },
                pictures: {
                    uploadedBy: true
                }
            }
        })
    }
}
