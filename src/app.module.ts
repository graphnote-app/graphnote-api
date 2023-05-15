import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Workspace } from './workspace.entity';
import { Document } from './document.entity';
import { UsersModule } from './users.module';
import { MessageController } from './message.controller';
import { Label } from './label.entity';
import { LabelLink } from './labelLink.entity';
import { Block } from './block.entity';

@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		url: process.env.DATABASE_URL,
		// host: 'localhost',
		// port: 5432,
		// username: 'postgres',
		// password: '',
		// database: process.env.DATABASE_URL || 'postgres',
		entities: [User, Message, Document, Workspace, Label, LabelLink, Block],
		synchronize: true,
	}), 
	UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
},)

export class AppModule {
  constructor(private dataSource: DataSource) {}
}
