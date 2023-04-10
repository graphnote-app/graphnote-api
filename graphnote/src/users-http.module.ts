import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { SyncService } from './sync.service';
import { MessageController } from './message.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [MessageController]
})
export class UserHttpModule {}
