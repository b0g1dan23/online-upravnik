import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Issue, IssueStatus, IssueStatusEnum } from './issues.entity';
import { CreateIssueDTO } from './DTOs/create-issue.dto';
import { FilterIssueDTO, SearchIssueDTO } from './DTOs/filter-search.dto';
import { Employee } from 'src/employees/employees.entity';

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
            .leftJoin(
                qb => qb
                    .select('"issueId", MAX("createdAt") as max_created_at')
                    .from('issue_status', 'is')
                    .groupBy('"issueId"'),
                'latest_status',
                'latest_status."issueId" = issue.id'
            )
            .leftJoin(
                'issue_status',
                'current_status',
                'current_status."issueId" = issue.id AND current_status."createdAt" = latest_status.max_created_at'
            )
            .addSelect(`
            CASE 
                WHEN current_status.status = 'RESOLVED' THEN 2
                WHEN current_status.status = 'CANCELLED' THEN 2
                ELSE 1
            END
        `, 'status_order')
            .where('issue.user.id = :userId', { userId })
            .orderBy('status_order', 'ASC')
            .addOrderBy('issue.createdAt', 'DESC')
            .addOrderBy('status.createdAt', 'DESC')
            .getMany();
    }

    async getAllIssues(page: number = 1, limit: number = 24): Promise<{ issues: Issue[], totalCount: number }> {
        const offset = (page - 1) * limit;

        const query = this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .leftJoinAndSelect('status.changedBy', 'statusChanger')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'pictureUploader')
            .leftJoin(
                qb => qb
                    .select('"issueId", MAX("createdAt") as max_created_at')
                    .from('issue_status', 'is')
                    .groupBy('"issueId"'),
                'latest_status',
                'latest_status."issueId" = issue.id'
            )
            .leftJoin(
                'issue_status',
                'current_status',
                'current_status."issueId" = issue.id AND current_status."createdAt" = latest_status.max_created_at'
            )
            .addSelect(`
                CASE 
                    WHEN current_status.status = 'RESOLVED' THEN 2
                    WHEN current_status.status = 'CANCELLED' THEN 2
                    ELSE 1
                END
            `, 'status_order')
            .orderBy('status_order', 'ASC')
            .addOrderBy('issue.createdAt', 'DESC')
            .addOrderBy('status.createdAt', 'DESC')
            .skip(offset)
            .take(limit);

        const [issues, totalCount] = await query.getManyAndCount();

        return { issues, totalCount };
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

    async updateIssueStatus(issueId: string, employeeID: string, updatedStatus: IssueStatusEnum) {
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
            const employeeResponsible = await manager.findOne(Employee, { where: { id: employeeID } });
            if (!employeeResponsible) {
                throw new NotFoundException('Employee not found');
            }
            const newStatus = manager.create(IssueStatus, {
                issue: issue,
                status: updatedStatus,
                changedBy: employeeResponsible
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
        return this.issueRepository
            .createQueryBuilder('issue')
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
        return this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'statusHistory')
            .leftJoinAndSelect('statusHistory.changedBy', 'statusChanger')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'pictureUploader')
            .leftJoin(
                qb => qb
                    .select('"issueId", MAX("createdAt") as max_created_at')
                    .from('issue_status', 'is')
                    .groupBy('"issueId"'),
                'latest_status',
                'latest_status."issueId" = issue.id'
            )
            .leftJoin(
                'issue_status',
                'current_status',
                'current_status."issueId" = issue.id AND current_status."createdAt" = latest_status.max_created_at'
            )
            .addSelect(`
            CASE 
                WHEN current_status.status = 'RESOLVED' THEN 2
                WHEN current_status.status = 'CANCELLED' THEN 2
                ELSE 1
            END
        `, 'status_order')
            .where('issue.building.id = :buildingId', { buildingId })
            .orderBy('status_order', 'ASC')
            .addOrderBy('issue.createdAt', 'DESC')
            .addOrderBy('statusHistory.createdAt', 'DESC')
            .getMany();
    }


    async filterIssues(filterData: FilterIssueDTO) {
        const queryBuilder = this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .leftJoinAndSelect('status.changedBy', 'statusChanger')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'pictureUploader');

        if (filterData.status) {
            queryBuilder.andWhere(
                'status.id IN (SELECT MAX(s.id) FROM issue_status s WHERE s.issueId = issue.id AND s.status = :status)',
                { status: filterData.status }
            );
        }
        if (filterData.buildingID) {
            queryBuilder.andWhere('building.id = :buildingId', { buildingId: filterData.buildingID });
        }

        if (filterData.employeeID) {
            queryBuilder.andWhere('employeeResponsible.id = :employeeId', { employeeId: filterData.employeeID });
        }

        if (filterData.userID) {
            queryBuilder.andWhere('user.id = :userId', { userId: filterData.userID });
        }

        if (filterData.dateFrom) {
            queryBuilder.andWhere('issue.createdAt >= :dateFrom', { dateFrom: filterData.dateFrom });
        }

        if (filterData.dateTo) {
            queryBuilder.andWhere('issue.createdAt <= :dateTo', { dateTo: filterData.dateTo });
        }

        queryBuilder.orderBy('issue.createdAt', 'DESC')
            .addOrderBy('status.createdAt', 'DESC');

        const totalCount = await queryBuilder.getCount();

        if (filterData.page && filterData.limit) {
            const offset = (filterData.page - 1) * filterData.limit;
            queryBuilder
                .skip(offset)
                .take(filterData.limit);
        }

        const issues = await queryBuilder.getMany();
        return { issues, totalCount };
    }

    async searchIssues(searchDto: SearchIssueDTO) {
        const queryBuilder = this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.user', 'user')
            .leftJoinAndSelect('issue.building', 'building')
            .leftJoinAndSelect('issue.employeeResponsible', 'employeeResponsible')
            .leftJoinAndSelect('issue.statusHistory', 'status')
            .leftJoinAndSelect('status.changedBy', 'statusChanger')
            .leftJoinAndSelect('issue.pictures', 'pictures')
            .leftJoinAndSelect('pictures.uploadedBy', 'pictureUploader');

        if (searchDto.searchTerm) {
            queryBuilder.andWhere('issue.problemDescription ILIKE :searchTerm', { searchTerm: `%${searchDto.searchTerm}%` });
        }

        queryBuilder.orderBy('issue.createdAt', 'DESC')
            .addOrderBy('status.createdAt', 'DESC');

        const totalCount = await queryBuilder.getCount();

        if (searchDto.page && searchDto.limit) {
            const offset = (searchDto.page - 1) * searchDto.limit;
            queryBuilder
                .skip(offset)
                .take(searchDto.limit);
        }

        const issues = await queryBuilder.getMany();
        return { issues, totalCount };
    }
}
