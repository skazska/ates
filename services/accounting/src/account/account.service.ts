import { Injectable } from '@nestjs/common';
import { TaskChangedDTO } from '../types/task';
import { TaskService } from '../task/task.service';
import { DbService } from '../db/db.service';
import { Knex } from 'knex';
import { CommOutCmdService } from '../comm-out/comm-out-cmd.service';
import { taskChangedValidator } from '../types/get-json-checker';

@Injectable()
export class AccountService {
  constructor(
    private task: TaskService,
    private db: DbService,
    private commOut: CommOutCmdService,
  ) {}

  /**
   * 1. set costs (if not yet): fee = rand(20..40), reward = rand(10..20)
   * 2. if status - completed - acount reward to assignee and fee to management
   * 3. otherwise account fee to assigny and reward to management rand(-10..-20)
   */
  public async processChange(task: TaskChangedDTO): Promise<void> {
    taskChangedValidator(task);
    const { fee, reward } = await this.task.getPrice(task);

    if (task.status === 'completed') {
      await this.accountReward(task, reward);
    } else {
      await this.accountFee(task, fee);
    }
  }

  /**
   * отрицательный баланс переносится на следующий день.
   * a) считать сколько денег сотрудник получил за рабочий день
   * После выплаты баланса (в конце дня) он должен обнуляться,
   * аудитлоге всех операций аккаунтинга должно быть отображено, что была выплачена сумма.
   */
  public async closeDay(): Promise<void> {
    await this.db.tRun(async (trx) => {
      const employees = await this.db.getEmployees(trx);

      for (const employee of employees) {
        await this.accountPayment(employee, trx);
      }
    });

    this.commOut.dayFixed();
  }

  private async accountReward(
    task: TaskChangedDTO,
    reward: number,
  ): Promise<void> {
    const { assignee, manager, uid } = task;

    await this.db.tRun(async (trx) => {
      await this.increaseBalance(
        assignee,
        {
          type: 'reward',
          amount: reward,
          task: uid,
        },
        trx,
      );

      if (manager) {
        await this.decreaseBalance(
          manager,
          {
            type: 'fee',
            amount: reward,
            task: uid,
          },
          trx,
        );
      }
    });
  }

  private async accountFee(task: TaskChangedDTO, fee: number): Promise<void> {
    const { assignee, manager, uid } = task;

    await this.db.tRun(async (trx) => {
      await this.decreaseBalance(
        assignee,
        {
          type: 'fee',
          amount: fee,
          task: uid,
        },
        trx,
      );

      if (manager) {
        await this.increaseBalance(
          manager,
          {
            type: 'reward',
            amount: fee,
            task: uid,
          },
          trx,
        );
      }
    });
  }

  private async accountPayment(
    employee: string,
    trx: Knex.Transaction,
  ): Promise<void> {
    await this.recountBalance(employee, trx);
    const balance = await this.db.getBalance(employee, trx);

    if (balance > 0) {
      await this.db.transaction(
        { employee, type: 'payment', amount: balance },
        trx,
      );
      await this.db.setBalance(employee, 0, trx);

      this.commOut.paid(employee, balance);
      this.commOut.balanceChanged(employee, 0);
    }
  }

  private async increaseBalance(
    employee: string,
    record: {
      type: string;
      amount: number;
      task?: string;
    },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const balance = await this.db.getBalance(employee, trx);

    await this.db.transaction({ ...record, employee }, trx);

    const newBalance = balance + record.amount;

    await this.db.setBalance(employee, newBalance, trx);

    this.commOut.balanceChanged(employee, newBalance);
  }

  private async decreaseBalance(
    employee: string,
    record: {
      type: string;
      amount: number;
      task?: string;
    },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const balance = await this.db.getBalance(employee, trx);

    await this.db.transaction({ ...record, employee }, trx);

    const newBalance = balance - record.amount;

    await this.db.setBalance(employee, newBalance, trx);

    this.commOut.balanceChanged(employee, newBalance);
  }

  private async recountBalance(
    employee: string,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const accounting = await this.db.getAccounting(employee, trx);

    return accounting.reduce(
      (acc, { amount, type }) => acc + (type === 'fee' ? -amount : amount),
      0,
    );
  }
}
