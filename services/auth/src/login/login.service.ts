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
    const login = await this.db.tRun(() => this.db.getLogin(signIn.email));

    if (!login || login.password !== getHashedPassword(signIn.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: login.uid,
      username: login.name,
      role: login.role,
    };

    return this.jwt.signAsync(payload);
  }

  public create(employee: EmployeeDTO): Promise<LoginDTO> {
    return this.db.tRun(async () => {
      const created = await this.db.createLogin({
        email: employee.email,
        name: employee.name,
        password: getHashedPassword('default'),
        role: employee.role,
        uid: employee.uid,
      });

      this.commOut.created(getmaskedPassword(created));

      return created;
    });
  }
}
