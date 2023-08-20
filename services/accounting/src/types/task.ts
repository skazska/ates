import { IsNotEmpty, IsDefined, IsEnum, IsUUID } from '@nestjs/class-validator';

// task DTO
export class TaskDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  assignee!: string;

  @IsDefined()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['assigned', 'completed'])
  status!: string;

  @IsDefined()
  @IsNotEmpty()
  title!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}

// employee cud DTO
export class TaskCudDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['created', 'updated', 'deleted'])
  action!: string;

  @IsDefined()
  @IsNotEmpty()
  payload!: TaskDTO;
}

export class TaskChangedDTO {
  @IsNotEmpty()
  @IsUUID()
  assignee?: string;

  @IsNotEmpty()
  @IsEnum(['assigned', 'completed'])
  status?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}
