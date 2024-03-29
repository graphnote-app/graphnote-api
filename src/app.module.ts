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
  imports: process.env.NODE_ENV == "production" ? [
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: process.env.DATABASE_URL,
	    ssl: {
	      require: true,
	      rejectUnauthorized: false
	    },
			entities: [User, Message, Document, Workspace, Label, LabelLink, Block],
			synchronize: true,
		}), 
		UsersModule
  ] : [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: '',
			database: 'postgres',
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
