import { Controller, Request, Post, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from 'src/users/DTOs/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() user: any) {
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body(ValidationPipe) createUserDto: CreateUserDTO) {
        return this.authService.register(createUserDto);
    }
}
