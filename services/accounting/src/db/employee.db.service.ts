import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class EmployeeDbService {
  private _knex: Knex;

  private schemaName = 'accounting';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async create(employee: EmployeeDTO): Promise<void> {
    await this.q().insert(employee);
  }

  public async update(employee: EmployeeDTO): Promise<void> {
    const { uid, ...data } = employee;
    await this.q().update(data).where({ uid });
  }

  public async delete(employee: EmployeeDTO): Promise<void> {
    await this.q().delete().where({ uid: employee.uid });
  }

  protected q<Rec extends object, Res = Rec[]>(): Knex.QueryBuilder<Rec, Res> {
    return this._knex('employees').withSchema(
      this.schemaName,
    ) as Knex.QueryBuilder<Rec, Res>;
  }
}
