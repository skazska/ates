import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getTokenFromHttp } from '../utils/auth';

export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private roles: string[]) {}

  public canActivate(context: ExecutionContext): boolean {
    const token = getTokenFromHttp(context.switchToHttp().getRequest());
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify<{
        sup: string;
        username: string;
        role: string;
      }>(token);

      if (!this.roles.includes(payload.role)) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

@Injectable()
export class AdminAuthGuard extends AuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService, ['admin']);
  }
}

@Injectable()
export class ManagerAuthGuard extends AuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService, ['manager']);
  }
}

@Injectable()
export class EmployeeAuthGuard extends AuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService, ['employee']);
  }
}

@Injectable()
export class AllAuthGuard extends AuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService, ['admin', 'employee', 'manager']);
  }
}

@Injectable()
export class PrivAuthGuard extends AuthGuard implements CanActivate {
  constructor(jwtService: JwtService) {
    super(jwtService, ['admin', 'manager']);
  }
}
