import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { EmployeesHttpController } from './employees.http.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [EmployeesHttpController, KafkaController],
  imports: [UserModule],
})
export class CommInModule {}
