import {
  IsNotEmpty,
  IsDefined,
  IsEnum,
  IsUUID,
  IsString,
  Matches,
} from '@nestjs/class-validator';

// task DTO
export class TaskDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  assignee!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsString()
  jiraId?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(['assigned', 'completed'])
  status!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(/[^[\]]+/)
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
  assignee!: string;

  @IsString()
  @IsUUID()
  manager?: string;

  @IsNotEmpty()
  @IsEnum(['assigned', 'completed'])
  status!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}
