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
  @IsEnum(['manager', 'employee'])
  role!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}

// employee cud DTO
export class EmployeeCudDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['created', 'updated', 'deleted'])
  action!: string;

  @IsDefined()
  @IsNotEmpty()
  payload!: EmployeeDTO;
}
