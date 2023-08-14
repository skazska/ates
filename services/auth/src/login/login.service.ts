import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { LoginDTO } from '../types/login';
import { CommOutService } from '../comm-out/comm-out.service';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class LoginService {
  constructor(private db: DbService, private commOut: CommOutService) {}

  public create(employee: EmployeeDTO): Promise<LoginDTO> {
    return this.db.tRun(async () => {
      const created = await this.db.createLogin({
        email: employee.email,
        password: this.getHashedPassword(''),
        role: employee.role,
        uid: employee.uid,
      });

      this.commOut.created(this.maskPassword(created));

      return created;
    });
  }

  private getHashedPassword(password: string): string {
    return password;
  }

  private maskPassword(login: LoginDTO): LoginDTO {
    return {
      ...login,
      password: '********',
    };
  }
}
