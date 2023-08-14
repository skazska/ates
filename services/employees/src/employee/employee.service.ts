import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { NewEmployeeDTO, EmployeeDTO } from '../types/employee';
import { CommOutService } from '../comm-out/comm-out.service';
import { CommOutCmdService } from '../comm-out/comm-out-cmd.service';
import { plainToClass } from '@nestjs/class-transformer';
import { LoginDTO } from '../types/login';

@Injectable()
export class EmployeeService {
  constructor(
    private db: DbService,
    private commOutService: CommOutService,
    private commOutCmd: CommOutCmdService,
  ) {}

  public async create(newUserDto: NewEmployeeDTO): Promise<EmployeeDTO> {
    const employee = await this.db.tRun(async () => {
      const created = await this.db.createEmployee(newUserDto);

      // {
      //   uid: created.uid,
      //     email: created.email,
      //   password: newUserDto.password,
      //   role: created.role,
      // }

      this.commOutCmd.createLogin(
        plainToClass(LoginDTO, { ...created, password: newUserDto.password }),
      );

      return created;
    });

    this.commOutService.created(employee);

    return employee;
  }

  public get(uid?: string): Promise<EmployeeDTO[]> {
    return this.db.getEmployee(uid);
  }
}
