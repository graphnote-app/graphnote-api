import { 
  Body, 
  Query, 
  Controller, 
  Get, 
  Post, 
  ConflictException, 
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SyncService } from './sync.service';
import { SyncMessage } from './sync.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly syncService: SyncService) {}
  
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

  @Post('message')
  async createMessage(@Body() body) {
    const message = body
    const id = message.id
    const type = message.type
    const timestamp = message.timestamp
    const action = message.action
    const isSynced = message.isSynced
    const contents = JSON.parse(message.contents)
    const messageObject = {id, timestamp, type, action, isSynced, contents}
    const createMessageSuccess = await this.syncService.createMessage(messageObject)
    console.log({createMessageSuccess})
    return createMessageSuccess
  }

  @Post('user')
  async createUser(@Body() body) {
    const message = body
    const contents = JSON.parse(message.contents)
    const id = contents.id
    const givenName = contents.givenName
    const familyName = contents.familyName
    const email = contents.email
    const createdAt = contents.createdAt
    const modifiedAt = contents.modifiedAt
    console.log({body})

    const user = await this.usersService.findOne(id)

    if (user != null) {
      console.log("User found id: " + id)
      throw new ConflictException()
    } else {
      const user = await this.usersService.create(id, email, familyName, givenName, createdAt, modifiedAt)
      const createMessageSuccess = await this.syncService.createMessage(message)
      console.log({user})
      console.log({createMessageSuccess})
      if (createMessageSuccess != null && user != null) {
        return user
      } else {
        throw new InternalServerErrorException()
      }
      
    }
  }
}
