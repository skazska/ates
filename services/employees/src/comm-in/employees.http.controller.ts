import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NewUserDTO, UserDTO } from '../types/user';
import { UserService } from '../user/user.service';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - create user
 * - get users
 * - authenticate
 */
@Controller('users')
export class EmployeesHttpController {
  public constructor(private userService: UserService) {
    console.log('HttpController.constructor()');
  }

  @Post()
  public async create(@Body() newUser: NewUserDTO): Promise<UserDTO> {
    return this.userService.create(newUser);
  }

  @Get()
  public async get(): Promise<UserDTO[]> {
    return this.userService.get();
  }

  @Get(':uid')
  public async getUser(@Query('uid') uid: string): Promise<UserDTO[]> {
    return this.userService.get(uid);
  }
}
