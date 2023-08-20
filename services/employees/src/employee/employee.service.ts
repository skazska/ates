import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  NewEmployeeDTO,
  EmployeeDTO,
  UpdateEmployeeDTO,
  DeleteEmployeeDTO,
} from '../types/employee';
import { CommOutService } from '../comm-out/comm-out.service';

@Injectable()
export class EmployeeService {
  constructor(private db: DbService, private commOutService: CommOutService) {}

  public async create(newUserDto: NewEmployeeDTO): Promise<EmployeeDTO> {
    const employee = await this.db.tRun(async (trx) => {
      const created = await this.db.createEmployee(newUserDto, trx);

      this.commOutService.created(created);

      return created;
    });

    return employee;
  }

  public async update(userDto: UpdateEmployeeDTO): Promise<EmployeeDTO> {
    const employee = await this.db.tRun(async (trx) => {
      const updated = await this.db.updateEmployee(userDto, trx);

      this.commOutService.updated(updated);

      return updated;
    });

    return employee;
  }

  public async delete(userDto: DeleteEmployeeDTO): Promise<EmployeeDTO> {
    const employee = await this.db.tRun(async (trx) => {
      const deleted = await this.db.deleteEmployee(userDto, trx);

      this.commOutService.deleted(deleted);

      return deleted;
    });

    return employee;
  }

  public get(uid?: string): Promise<EmployeeDTO[]> {
    return this.db.getEmployee(uid);
  }
}
