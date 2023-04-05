import { Query, Controller, Get, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  createUser(@Query() query) {
    const id = query.id

    const success = this.usersService.createUser(id)

    if (success) {
      return 'Success'
    } else {
      throw new BadRequestException()
    }
  }
}
