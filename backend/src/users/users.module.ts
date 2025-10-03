import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        BuildingsModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' }
            }),
        }), EmployeesModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
