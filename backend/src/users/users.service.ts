import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTOs/create-user.dto';
import { BuildingsService } from 'src/buildings/buildings.service';
import { ViewUserBaseDTO } from './DTOs/view-user-base.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly buildingService: BuildingsService,
    ) { }

    async createUser(userData: CreateUserDTO) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = this.userRepository.create(userData);
        user.buildingLivingIn = await this.buildingService.findBuildingByID(userData.buildingLivingInID);
        const savedUser = await this.userRepository.save(user);
        return new ViewUserBaseDTO(savedUser);
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new NotFoundException("User with that email not found!");
        return user;
    }

    async findAllUsers() {
        const users = await this.userRepository.find({
            relations: {
                buildingLivingIn: true
            }
        });
        return users.map(user => new ViewUserBaseDTO(user));
    }

    async findUserByID(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                buildingLivingIn: true
            }
        });
        if (!user)
            throw new NotFoundException("User with that ID not found!");
        return new ViewUserBaseDTO(user);
    }
}
