import { Body, Controller, Get, Post, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async createUser(@Body() body) {
    const id = body.id

    const user = await this.usersService.findOne(id)

    if (user != null) {
      console.log("User found id: " + id)
      throw new ConflictException()
    } else {
      const user = await this.usersService.create(id)
      return user
    }
  }
}
