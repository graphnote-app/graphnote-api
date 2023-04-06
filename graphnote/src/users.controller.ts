import { 
  Body, 
  Query, 
  Controller, 
  Get, 
  Post, 
  ConflictException, 
  NotFoundException 
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get('user')
    async fetchUser(@Query() query) {
      const id = query.id
      const user = await this.usersService.findOne(id)
      if (user == null) {
        throw new NotFoundException()  
      } else {
        return user
      }
    }


  @Post('user')
  async createUser(@Body() body) {
    const id = body.id
    const givenName = body.givenName
    const familyName = body.familyName
    const email = body.email
    const createdAt = body.createdAt
    const modifiedAt = body.modifiedAt

    console.log({body})


    const user = await this.usersService.findOne(id)

    if (user != null) {
      console.log("User found id: " + id)
      throw new ConflictException()
    } else {
      const user = await this.usersService.create(id, email, familyName, givenName, createdAt, modifiedAt)
      console.log({user})
      return user
    }
  }
}
