import { Injectable } from '@nestjs/common';
import {TaskChangedDTO, TaskCudDTO} from '../types/task';
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
    const { assignee, description, status, title, uid } = payload;

    const task = { assignee, description, status, title, uid };

    switch (action) {
      case 'created':
        await this.db.create(task);
        break;
      case 'updated':
        await this.db.update(task);
        break;
      case 'deleted':
        await this.db.delete(task);
        break;
      default:
        throw new Error(`unknown action: ${action}`);
    }
  }

  /**
   * 1. set costs (if not yet)
   * 2. if status - completed - acount reward to assignee and fee to management
   * 3. otherwise account fee to assigny and reward to management
   */
  public processChange(task: TaskChangedDTO): Promise<void> {

  }
}
