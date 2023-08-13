import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NewEmployeeDTO, EmployeeDTO } from '../types/employee';
import { EmployeeService } from '../employee/employee.service';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - create user
 * - get users
 * - authenticate
 */
@Controller('users')
export class EmployeesHttpController {
  public constructor(private userService: EmployeeService) {
    console.log('HttpController.constructor()');
  }

  @Post()
  public async create(@Body() newUser: NewEmployeeDTO): Promise<EmployeeDTO> {
    return this.userService.create(newUser);
  }

  @Get()
  public async get(): Promise<EmployeeDTO[]> {
    return this.userService.get();
  }

  @Get(':uid')
  public async getUser(@Query('uid') uid: string): Promise<EmployeeDTO[]> {
    return this.userService.get(uid);
  }
}
