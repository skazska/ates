import { IsDefined, IsEnum, IsNotEmpty, IsUUID } from '@nestjs/class-validator';

// login DTO
export class LoginDTO {
  @IsDefined()
  @IsNotEmpty()
  email!: string;

  @IsUUID()
  employee?: string;

  @IsDefined()
  @IsNotEmpty()
  name!: string;

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

// create login DTO
export class CreateLoginDTO {
  @IsDefined()
  @IsNotEmpty()
  email!: string;

  @IsUUID()
  employee?: string;

  @IsDefined()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['admin', 'manager', 'user'])
  role!: string;
}

export class UpdateLoginDTO {
  @IsDefined()
  @IsNotEmpty()
  email!: string;

  @IsDefined()
  employee!: string;

  @IsNotEmpty()
  name?: string;

  @IsDefined()
  @IsNotEmpty()
  password?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['admin', 'manager', 'user'])
  role!: string;
}

export class DeleteLoginDTO {
  @IsDefined()
  @IsNotEmpty()
  employee!: string;
}
