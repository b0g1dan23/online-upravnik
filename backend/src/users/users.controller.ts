import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTOs/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body(ValidationPipe) createUserDto: CreateUserDTO) {
        return this.usersService.createUser(createUserDto);
    }
}
