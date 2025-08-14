import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import argon from 'argon2';
import { ViewUserBaseDTO } from 'src/users/DTOs/view-user-base.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        const isPasswordValid = await argon.verify(user.password, password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");
        const retrieveUser = new ViewUserBaseDTO(user);
        return retrieveUser;
    }
}
