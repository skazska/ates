import { IsDefined, IsEnum, IsNotEmpty } from '@nestjs/class-validator';

// auth DTO
export class LoginDTO {
  @IsDefined()
  @IsNotEmpty()
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['manager', 'user'])
  role!: string;
}
