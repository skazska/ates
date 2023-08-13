import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { NewUserDTO, UserDTO } from '../types/user';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  public create(newUserDto: NewUserDTO): Promise<UserDTO> {
    return this.db.createUser(newUserDto);
  }

  public get(uid?: string): Promise<UserDTO[]> {
    return this.db.getUsers(uid);
  }
}
