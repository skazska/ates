import { IsNotEmpty, IsDefined, IsEnum, IsUUID } from '@nestjs/class-validator';

// employee DTO
export class EmployeeDTO {
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
