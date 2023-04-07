import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Document } from './document.entity';

enum SyncMessageType {
  document = "document"
}

enum SyncMessageAction {
  create = "create"
}

export type SyncMessage = {
    id: string;
    timestamp: string;
    type: SyncMessageType;
    action: SyncMessageAction;
    isSynced: boolean;
    contents: string;
}

Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,

  ) {}

  
	async createMessage(message: SyncMessage): Promise<boolean> {
		console.log("createMessage")
		let messageEntity = new Message()
		messageEntity.id = message.id
		messageEntity.timestamp = message.timestamp
		messageEntity.type = message.type
		messageEntity.action = message.action
		messageEntity.isSynced = message.isSynced
		messageEntity.contents = message.contents
		
		var success = await this.messagesRepository.save(messageEntity) != null

		// Temp process events here. Later queue them up.
		if (message.type == 'document') {
			if (message.action == 'create') {
				// Create the document on the server now!
				console.log(message.contents)
				const _doc = JSON.parse(JSON.stringify(message.contents))
				const doc = new Document()
		    doc.id = _doc.id
		    doc.title = _doc.title
		    doc.workspace = _doc.workspace
		    doc.modifiedAt = _doc.modifiedAt 
		    doc.createdAt = _doc.createdAt
		    console.log({doc})
		    success = success && await this.documentsRepository.save(doc) != null

			} else {
				success = false
			}
		} else {
			success = false
		}

		if (success) {
			messageEntity.isSynced = true
	 		success = await this.messagesRepository.save(messageEntity) != null			
		}

		return success
	}
}
