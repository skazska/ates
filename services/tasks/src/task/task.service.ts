import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CompleteTaskDTO, NewTaskDTO, TaskDTO } from '../types/task';
import { CommOutCmdService } from '../comm-out/comm-out-cmd.service';
import { Token } from '../../../../lib/types/jwt';
import { CommOutServiceV2 } from '../comm-out/comm-out.service_v2';

@Injectable()
export class TaskService {
  constructor(
    private db: DbService,
    private commOut: CommOutServiceV2,
    private commOutCmd: CommOutCmdService,
  ) {}

  public async create(newTask: NewTaskDTO): Promise<TaskDTO> {
    const task = await this.db.tRun(async (trx) => {
      const employeeUids = await this.getEmployeeUids();
      const assignee =
        employeeUids[Math.floor(Math.random() * employeeUids.length)];

      if (!assignee) {
        throw new Error('No employees found to assign task to');
      }

      const created = await this.db.createTask(newTask, assignee, trx);

      this.commOut.created(created);
      this.commOutCmd.changed(created);

      return created;
    });

    return task;
  }

  public async assignTasks(): Promise<void> {
    const employeeUids = await this.getEmployeeUids();
    const tasks = await this.db.getTasks();

    for (const task of tasks) {
      const assignee =
        employeeUids[Math.floor(Math.random() * employeeUids.length)];
      task.assignee = assignee;

      await this.db.updateTask(task);

      this.commOutCmd.changed(task);
    }
  }

  public async completeTasks(
    complete: CompleteTaskDTO,
    employeeUid: string,
  ): Promise<void> {
    await this.db.tRun(async (trx) => {
      const updated = await this.db.completeTask(complete, employeeUid, trx);

      if (updated) {
        this.commOutCmd.changed(updated);
      } else {
        throw new BadRequestException(
          'You are not assigned to this task or task is already completed',
        );
      }
    });
  }

  public get(auth: Token): Promise<TaskDTO[]> {
    if (auth.role === 'employee') {
      return this.db.getTasks(auth.employee);
    }

    return this.db.getTasks();
  }

  private async getEmployeeUids(): Promise<string[]> {
    const rows = await this.db.getEmployees();

    return rows.map((row) => row.uid);
  }
}
