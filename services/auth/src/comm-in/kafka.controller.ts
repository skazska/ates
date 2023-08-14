import { Controller } from '@nestjs/common';
import { LoginService } from '../login/login.service';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { EmployeeCudDTO } from '../types/employee';

@Controller('kafka')
export class KafkaController {
  public constructor(private login: LoginService) {}

  /**
   * process new employee cud events
   */
  @MessagePattern('employees-cud', Transport.KAFKA)
  public async created(payload: EmployeeCudDTO): Promise<void> {
    const { action, payload: employee } = payload;

    switch (action) {
      case 'created':
        await this.login.create(employee);
        break;
      default:
        throw new Error(`unknown action: ${payload.action}`);
    }
  }
}
