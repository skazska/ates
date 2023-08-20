import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth-guard';
import { Roles } from './roles.decorator';
import { TaskService } from '../task/task.service';
import { CompleteTaskDTO, NewTaskDTO, TaskDTO } from '../types/task';
import { Token } from '../../../../lib/types/jwt';
import { HttpExceptionFilter } from './exception.filter';

/**
 * HttpController contains the HTTP endpoints for this service.
 */
@Controller('board')
@UseFilters(new HttpExceptionFilter())
export class BoardHttpController {
  constructor(private tasks: TaskService) {}

  @Get('tasks')
  @Roles('admin', 'employee', 'manager')
  @UseGuards(AuthGuard)
  public async get(
    @Headers('x-token-data') tokenData: string,
  ): Promise<TaskDTO[]> {
    const auth = JSON.parse(tokenData) as Token;
    return this.tasks.get(auth);
  }

  @Post('tasks')
  @Roles('admin', 'employee', 'manager')
  @UseGuards(AuthGuard)
  public async create(@Body() newTask: NewTaskDTO): Promise<TaskDTO> {
    return this.tasks.create(newTask);
  }

  @Post('tasks/reassign')
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard)
  public async reassign(): Promise<string> {
    await this.tasks.assignTasks();

    return 'OK';
  }

  @Post('tasks/complete')
  @Roles('employee')
  @UseGuards(AuthGuard)
  public async complete(
    @Body() complete: CompleteTaskDTO,
    @Headers('x-token-data') tokenData: string,
  ): Promise<string> {
    const auth = JSON.parse(tokenData) as Token;
    await this.tasks.completeTasks(complete, auth.employee);

    return 'OK';
  }
}
