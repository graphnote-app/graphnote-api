import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Document } from './document.entity';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: '',
		database: 'postgres',
		entities: [User, Message, Document],
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
