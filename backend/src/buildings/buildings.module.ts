import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { Building } from './buildings.entity';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building]),
    EmployeesModule
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
  exports: [BuildingsService]
})
export class BuildingsModule { }
