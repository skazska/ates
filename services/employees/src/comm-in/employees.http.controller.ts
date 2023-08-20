import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  NewEmployeeDTO,
  EmployeeDTO,
  UpdateEmployeeDTO,
  DeleteEmployeeDTO,
} from '../types/employee';
import { EmployeeService } from '../employee/employee.service';
import { HttpExceptionFilter } from './exception.filter';
import { Roles } from './roles.decorator';
import { AuthGuard } from './auth-guard';

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

  @Post()
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard)
  public async create(@Body() newUser: NewEmployeeDTO): Promise<EmployeeDTO> {
    return this.userService.create(newUser);
  }

  @Put()
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard)
  public async update(@Body() user: UpdateEmployeeDTO): Promise<EmployeeDTO> {
    return this.userService.update(user);
  }

  @Delete()
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard)
  public async delete(@Body() user: DeleteEmployeeDTO): Promise<EmployeeDTO> {
    return this.userService.delete(user);
  }

  @Get()
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard)
  public async get(): Promise<EmployeeDTO[]> {
    return this.userService.get();
  }
}
