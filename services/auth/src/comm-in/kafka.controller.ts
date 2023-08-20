import { Controller } from '@nestjs/common';
import { LoginService } from '../login/login.service';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EmployeeCudDTO } from '../types/employee';

@Controller()
export class KafkaController {
  public constructor(private login: LoginService) {}

  /**
   * process new employee cud events
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @EventPattern('employees-cud', Transport.KAFKA)
  public async created(@Payload() payload: EmployeeCudDTO): Promise<void> {
    console.log(`KafkaController.created(${JSON.stringify(payload)})`);

    const { action, payload: employee } = payload;

    switch (action) {
      case 'created':
        await this.login.create(employee);
        break;
      case 'updated':
        await this.login.update(employee);
        break;
      case 'deleted':
        await this.login.delete(employee);
        break;
      default:
        throw new Error(`unknown action: ${payload.action}`);
    }
  }
}
