import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { SyncService } from './sync.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [SyncService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
