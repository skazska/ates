import {
  IsEmail,
  IsNotEmpty,
  IsDefined,
  IsEnum,
  IsUUID,
} from '@nestjs/class-validator';

// employee DTO
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
  @IsEnum(['admin', 'employee', 'manager'])
  role!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}

// new employee DTO
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
  @IsEnum(['admin', 'employee', 'manager'])
  role!: string;
}

// update employee DTO
export class UpdateEmployeeDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsDefined()
  @IsNotEmpty()
  name?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['admin', 'employee', 'manager'])
  role?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}

// delete employee DTO
export class DeleteEmployeeDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}
