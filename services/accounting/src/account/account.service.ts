import { Injectable } from '@nestjs/common';
import {TaskChangedDTO} from "../types/task";
import {TaskService} from "../task/task.service";
import {EmployeeService} from "../employee/employee.service";

@Injectable()
export class AccountService {
  constructor(private task: TaskService, private employee: EmployeeService) {

  }

  /**
   * 1. set costs (if not yet): fee = rand(20..40), reward = rand(10..20)
   * 2. if status - completed - acount reward to assignee and fee to management
   * 3. otherwise account fee to assigny and reward to management rand(-10..-20)
   */
  public async processChange(task: TaskChangedDTO): Promise<void> {
    const { fee, reward } = await this.task.getPrice(task);

    if (task.status === 'completed') {
      await this.accountReward(task, reward);
    } else {
      await this.accountFee(task, fee);
    }
  }

  private async accountReward(task: TaskChangedDTO, reward: number): Promise<void> {}

  private async accountFee(task: TaskChangedDTO, fee: number): Promise<void> {}

}
