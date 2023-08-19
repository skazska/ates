import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { EmployeesHttpController } from './employees.http.controller';
import { EmployeeModule } from '../employee/employee.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EmployeesHttpController, HttpController, KafkaController],
  imports: [
    EmployeeModule,
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
  ],
})
export class CommInModule {}
