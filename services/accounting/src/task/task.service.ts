import { Injectable } from '@nestjs/common';
import { TaskCudDTO } from '../types/task';
import { taskCudValidator } from '../types/get-json-checker';
import { TaskDbService } from '../db/task.db.service';

@Injectable()
export class TaskService {
  constructor(private db: TaskDbService) {}

  public async sync(dto: TaskCudDTO): Promise<void> {
    if (!taskCudValidator(dto)) {
      throw new Error(JSON.stringify(taskCudValidator.errors));
    }

    const { action, payload } = dto;
    const { name, role, uid } = payload;

    const employee = { name, role, uid };

    switch (action) {
      case 'created':
        await this.db.create(employee);
        break;
      case 'updated':
        await this.db.update(employee);
        break;
      case 'deleted':
        await this.db.delete(employee);
        break;
      default:
        throw new Error(`unknown action: ${action}`);
    }
  }
}
