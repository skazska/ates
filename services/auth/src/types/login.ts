import { IsDefined, IsEnum, IsNotEmpty, IsUUID } from '@nestjs/class-validator';

// login DTO
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

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}
