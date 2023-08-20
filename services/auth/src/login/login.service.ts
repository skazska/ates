import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { LoginDTO } from '../types/login';
import { CommOutService } from '../comm-out/comm-out.service';
import { EmployeeDTO } from '../types/employee';
import { SignInDTO } from '../types/sign';
import { JwtService } from '@nestjs/jwt';
import { getHashedPassword, getmaskedPassword } from '../utils/password';

@Injectable()
export class LoginService {
  constructor(
    private jwt: JwtService,
    private db: DbService,
    private commOut: CommOutService,
  ) {}

  public async getToken(signIn: SignInDTO): Promise<string> {
    const login = await this.db.getLogin(signIn.email);

    if (!login || login.password !== getHashedPassword(signIn.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      login: login.uid,
      role: login.role,
      employee: login.employee,
    };

    return this.jwt.signAsync(payload);
  }

  public create(employee: EmployeeDTO): Promise<LoginDTO> {
    return this.db.tRun(async (trx) => {
      const created = await this.db.createLogin(
        {
          employee: employee.uid,
          email: employee.email,
          name: employee.name,
          password: getHashedPassword('default'),
          role: employee.role,
        },
        trx,
      );

      this.commOut.created(getmaskedPassword(created));

      return created;
    });
  }

  public update(employee: EmployeeDTO): Promise<LoginDTO> {
    return this.db.tRun(async (trx) => {
      const updated = await this.db.updateLogin(
        {
          employee: employee.uid,
          email: employee.email,
          name: employee.name,
          role: employee.role,
        },
        trx,
      );

      this.commOut.updated(getmaskedPassword(updated));

      return updated;
    });
  }

  public delete(employee: EmployeeDTO): Promise<LoginDTO> {
    return this.db.tRun(async (trx) => {
      const deleted = await this.db.deleteLogin(
        {
          employee: employee.uid,
        },
        trx,
      );

      this.commOut.deleted(getmaskedPassword(deleted));

      return deleted;
    });
  }
}
