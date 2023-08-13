import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { NewEmployeeDTO, EmployeeDTO } from '../types/employee';
import { CommOutService } from '../comm-out/comm-out.service';

@Injectable()
export class EmployeeService {
  constructor(private db: DbService, private commOutService: CommOutService) {}

  public async create(newUserDto: NewEmployeeDTO): Promise<EmployeeDTO> {
    const employee = await this.db.createEmployee(newUserDto);

    this.commOutService.created(employee);

    return employee;
  }

  public get(uid?: string): Promise<EmployeeDTO[]> {
    return this.db.getEmployee(uid);
  }
}
