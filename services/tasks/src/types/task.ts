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

export class NewTaskDTO {
  @IsDefined()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsNotEmpty()
  title!: string;
}

export class UpdateTaskDTO {
  @IsNotEmpty()
  @IsUUID()
  assignee?: string;

  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['assigned', 'completed'])
  status?: string;

  @IsNotEmpty()
  title?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}

export class CompleteTaskDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  uid!: string;
}
