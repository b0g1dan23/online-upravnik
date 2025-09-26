import { Controller, Post, UseGuards, Body, ValidationPipe, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from 'src/users/DTOs/create-user.dto';
import { ViewUserBaseDTO } from 'src/users/DTOs/view-user-base.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request & { user: ViewUserBaseDTO }, @Res({ passthrough: true }) res: Response) {
        if (req.user !== null) {
            const data = await this.authService.login(req as any);
            res.cookie('access_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200);
            return data;
        }
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token");
    }

    @Post('register')
    async register(@Body(ValidationPipe) createUserDto: CreateUserDTO, @Res({ passthrough: true }) res: Response) {
        const data = await this.authService.register(createUserDto);
        res.cookie('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        return data;
    }
}
