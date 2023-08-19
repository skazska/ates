import { FastifyRequest } from 'fastify';

export function getTokenFromHttp(request: FastifyRequest): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
