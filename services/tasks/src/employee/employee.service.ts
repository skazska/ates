import { Injectable } from '@nestjs/common';
import { EmployeeCudDTO } from '../types/employee';
import { SyncEmployeeDbService } from '../db/sync-employee.db.service';

@Injectable()
export class EmployeeService {
  constructor(private db: SyncEmployeeDbService) {}

  public async sync({ action, payload }: EmployeeCudDTO): Promise<void> {
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
