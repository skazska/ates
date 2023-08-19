import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NewEmployeeDTO, EmployeeDTO } from '../types/employee';
import { EmployeeService } from '../employee/employee.service';
import { HttpExceptionFilter } from './exception.filter';
import { PrivAuthGuard } from './auth-guard';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - create user
 * - get users
 * - authenticate
 */
@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class EmployeesHttpController {
  public constructor(private userService: EmployeeService) {
    console.log('HttpController.constructor()');
  }

  @UseGuards(PrivAuthGuard)
  @Post()
  public async create(@Body() newUser: NewEmployeeDTO): Promise<EmployeeDTO> {
    return this.userService.create(newUser);
  }

  @UseGuards(PrivAuthGuard)
  @Get()
  public async get(): Promise<EmployeeDTO[]> {
    return this.userService.get();
  }
}
