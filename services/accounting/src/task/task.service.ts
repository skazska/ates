import { Injectable } from '@nestjs/common';
import { TaskChangedDTO, TaskCudDTO } from '../types/task';
import { taskCudValidator } from '../types/get-json-checker';
import { TaskDbService } from '../db/task.db.service';
import { CommOutCmdService } from '../comm-out/comm-out-cmd.service';

@Injectable()
export class TaskService {
  constructor(private db: TaskDbService, private commOut: CommOutCmdService) {}

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
   * fee = rand(20..40), reward = rand(10..20)
   */
  public async getPrice(
    task: TaskChangedDTO,
  ): Promise<{ fee: number; reward: number }> {
    const price = await this.db.getPrice(task.uid);

    if (price) {
      return price;
    }

    const fee = Math.random() * 20 + 20;
    const reward = Math.random() * 10 + 10;

    await this.db.setPrice(task.uid, fee, reward);

    this.commOut.priceSet(task.uid, fee, reward);

    return { fee, reward };
  }
}
