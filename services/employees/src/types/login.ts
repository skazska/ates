import { IsDefined, IsNotEmpty } from '@nestjs/class-validator';

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
  role!: string;
}
