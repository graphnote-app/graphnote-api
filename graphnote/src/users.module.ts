import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { SyncService } from './sync.service';
import { MessageController } from './message.controller';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';
import { Message } from './message.entity';
import { Document } from './document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Document, Workspace])],
  providers: [SyncService, UsersService],
  controllers: [MessageController],
})
export class UsersModule {}
