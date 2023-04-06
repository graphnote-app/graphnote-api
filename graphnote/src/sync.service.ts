import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

enum SyncMessageType {
  createUser = "createUser"
}

type SyncMessage = {
    id: string;
    timestamp: string;
    type: SyncMessageType;
    contents: string;
}

Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  
	async createMessage(message: SyncMessage): Promise<boolean> {
		let messageEntity = new Message()
		messageEntity.id = message.id
		messageEntity.timestamp = message.timestamp
		messageEntity.type = message.type
		messageEntity.contents = message.contents
		
		return await this.messagesRepository.save(messageEntity) != null

	}
}
