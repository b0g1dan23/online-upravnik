import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import argon from 'argon2';
import { ViewUserBaseDTO } from 'src/users/DTOs/view-user-base.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        const isPasswordValid = await argon.verify(user.password, password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");
        const retrieveUser = new ViewUserBaseDTO(user);
        return retrieveUser;
    }

    async login(data: { user: ViewUserBaseDTO }) {
        console.log(data.user);
        const payload = { id: data.user.id, role: data.user.role };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
