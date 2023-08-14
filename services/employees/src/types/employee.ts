import { IsEmail, IsNotEmpty, IsDefined } from '@nestjs/class-validator';

// user DTO
export class EmployeeDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsNotEmpty()
  uid!: string;

  @IsDefined()
  @IsNotEmpty()
  role!: string;
}

// new user DTO
export class NewEmployeeDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsNotEmpty()
  role!: string;
}
