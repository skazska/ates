import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../../../lib/types/jwt';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const token = this.getTokenFromContext(context);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify<Token>(token);

      if (!roles.includes(payload.role)) {
        throw new UnauthorizedException();
      }

      this.setTokenToHttp(context, payload);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private getTokenFromContext(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private setTokenToHttp(context: ExecutionContext, data: Token): void {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    request.headers['x-token-data'] = JSON.stringify(data);
  }
}
