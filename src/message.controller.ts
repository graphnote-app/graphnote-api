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
export class MessageController {
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

  @Get('message/ids')
  async fetchMessageIDs(@Query() query) {
    console.log({query})
    const user = query.user
    const lastSyncTime = new Date(query.last / 1).toISOString()
    
    const syncTime = new Date().getTime()
    const ids = await this.syncService.fetchMessageIDs(user, lastSyncTime)
    console.log({ids})
    
    if (ids != null) {
      return await JSON.stringify({ids: ids, lastSyncTime: syncTime})
    } else {
      throw new NotFoundException()  
    }
  }

  @Post('messages')
  async fetchMessages(@Body() body) {
    const ids = body['messageIds']
    var results = []

    for (const id of ids) {
      const result = await this.syncService.fetchMessage(id)
      if (result == null) {
          throw new NotFoundException()
      } else {
        results.push(result)
      }  
    }

    return results
  }

  @Post('message/create')
  async createMessage(@Body() body) {
    const message = body as SyncMessage
    console.log({message})
    const id = message.id
    const type = message.type
    const user = message.user
    const timestamp = message.timestamp
    const action = message.action
    const isSynced = message.isSynced
    const contents = message.contents
    const serverReceivedTime = new Date().getTime()
    console.log({serverReceivedTime})
    const messageObject = new SyncMessage(id, user, timestamp, type, action, isSynced, false, contents, serverReceivedTime)
    const createMessageSuccess = await this.syncService.createMessage(messageObject)
    console.log({createMessageSuccess})
    return createMessageSuccess
  }
}
