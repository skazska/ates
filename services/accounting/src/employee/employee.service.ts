import { Injectable } from '@nestjs/common';
import { TaskCudDTO } from '../types/employee';
import { EmployeeDbService } from '../db/employee.db.service';
import { employeeCudValidator } from '../types/get-json-checker';

@Injectable()
export class EmployeeService {
  constructor(private db: EmployeeDbService) {}

  public async sync(dto: TaskCudDTO): Promise<void> {
    if (!employeeCudValidator(dto)) {
      throw new Error(JSON.stringify(employeeCudValidator.errors));
    }

    const { action, payload } = dto;
    const { name, role, uid } = payload;

    const employee = { name, role, uid };

    switch (action) {
      case 'created':
        await this.db.create(employee);
        break;
      case 'updated':
        await this.db.update(employee);
        break;
      case 'deleted':
        await this.db.delete(employee);
        break;
      default:
        throw new Error(`unknown action: ${action}`);
    }
  }
}
