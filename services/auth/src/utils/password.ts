import { LoginDTO } from '../types/login';

export function getHashedPassword(password: string): string {
  return password;
}

export function getmaskedPassword(login: LoginDTO): LoginDTO {
  return {
    ...login,
    password: '********',
  };
}
