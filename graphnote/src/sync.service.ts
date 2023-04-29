import { Injectable } from '@nestjs/common';
import { MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Document } from './document.entity';
import { Workspace, WorkspaceDTO } from './workspace.entity';
import { User } from './user.entity';
import { UserDTO } from './users.service';
import { Label, LabelDTO } from './label.entity';
import { LabelLink, LabelLinkDTO } from './labelLink.entity';
import { Block, BlockDTO } from './block.entity';
import { UsersService } from './users.service';

enum SyncMessageType {
  document = "document"
}

enum SyncMessageAction {
  create = "create"
}

export class SyncMessage {
    id: string;
    user: string;
    timestamp: number;
    type: SyncMessageType;
    action: SyncMessageAction;
    isSynced: boolean;
    isApplied: boolean;
    contents: string;
    serverReceivedTime: number;

    constructor(
    	id: string, 
    	user: string,
    	timestamp: number,
    	type: SyncMessageType,
    	action: SyncMessageAction,
    	isSynced: boolean,
    	isApplied: boolean,
    	contents: string,
    	serverReceivedTime: number
    ) {
    	this.id = id
    	this.user = user
    	this.timestamp = timestamp
    	this.type = type
    	this.action = action 
    	this.isSynced = isSynced
    	this.isApplied = isApplied
    	this.contents = contents
    	this.serverReceivedTime = serverReceivedTime
    }
}

Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelLink)
    private labelLinkRepository: Repository<LabelLink>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private readonly usersService: UsersService
  ) {}

  async fetchMessageIDs(user: UserDTO, lastSyncTime: string | null): Promise<Array<string> | null> {
  	console.log(lastSyncTime)
  	if (lastSyncTime == null) {
			return (await this.messagesRepository
	  		.find({
	  			select: {
	        	id: true,
	    		},
	    		where: {
	    			user: user.id,
	    		},
	  		})).map(item => item.id)	
  	} else {
	  	return (await this.messagesRepository
	  		.find({
	  			select: {
	        	id: true,
	    		},
	    		where: {
	    			user: user.id,
	    			serverReceivedTime: MoreThan(lastSyncTime)
	    		},
	  		})).map(item => item.id)	
  	}	
  }

  async fetchMessage(id: string): Promise<SyncMessage | null> {
  	console.log({id})
  	const messages = await this.messagesRepository.find({where: {id: id}})

  	if (messages.length > 0) {
  		const message = messages[0]
  		const messageOut = new SyncMessage(
  			message.id,
  			message.user, 
  			new Date(message.timestamp).getTime(),
  			message.type as SyncMessageType,
  			message.action as SyncMessageAction,
  			message.isSynced,
  			false,
  			message.contents,
  			new Date(message.serverReceivedTime).getTime()
  		)
  		console.log({messageOut})
  		return messageOut
  	} else {
  		return null	
  	}

  }

  async createWorkspace(workspace: WorkspaceDTO): Promise<boolean> {
  	console.log({workspace})
  	let workspaceEntity = new Workspace()
		workspaceEntity.id = workspace.id
		workspaceEntity.title = workspace.title
		workspaceEntity.user = workspace.user
		workspaceEntity.labels = workspace.labels
		workspaceEntity.documents = workspace.documents
		workspaceEntity.createdAt = workspace.createdAt
		workspaceEntity.modifiedAt = workspace.modifiedAt
		return await this.workspaceRepository.save(workspaceEntity) != null
  }

  
	async createMessage(message: SyncMessage): Promise<boolean> {
		let messageEntity = new Message()
		messageEntity.id = message.id
		messageEntity.user = message.user
		messageEntity.timestamp = new Date(message.timestamp / 1).toISOString()
		messageEntity.type = message.type
		messageEntity.action = message.action
		messageEntity.isSynced = true
		messageEntity.contents = message.contents
		messageEntity.serverReceivedTime = new Date(message.serverReceivedTime / 1).toISOString()

		var success = await this.messagesRepository.save(messageEntity) != null

		// Temp process events here. Later queue them up.
		if (message.type == 'document') {
			if (message.action == 'create') {
				// Create the document on the server now!
				const _doc = JSON.parse(message.contents)
				const doc = new Document()
		    doc.id = _doc.id
		    doc.title = _doc.title
		    doc.workspace = _doc.workspace
		    doc.modifiedAt = new Date(_doc.modifiedAt / 1).toISOString()
		    doc.createdAt = new Date(_doc.createdAt / 1).toISOString()
		    console.log({doc})
		    success = success && await this.documentsRepository.save(doc) != null

		  } else if (message.action == 'update') {
		  	
				const keyValues = JSON.parse(message.contents)
				const id = keyValues["id"]
				console.log({id})
				const doc = await this.documentsRepository.findOneBy({id})
				if (doc != null) {
					console.log("timestamp:", message.timestamp)
					console.log("modifiedAt:", doc.modifiedAt)
					if (new Date(message.timestamp) > new Date(doc.modifiedAt)) {
						doc["title"] = keyValues["content"]["title"]
				    doc.modifiedAt = new Date(message.timestamp / 1).toISOString()

				    console.log({doc})
						success = success && await this.documentsRepository.save(doc) != null	
					}

				} else {
					success = false
				}
		    success = success && await this.documentsRepository.save(doc) != null
			} else {
				success = false
			}
		} else if (message.type == 'user') {
			if (message.action == 'create') {
		    const contents = JSON.parse(message.contents)
		    const id = contents.id
		    const givenName = contents.givenName
		    const familyName = contents.familyName
		    const email = contents.email
		    const createdAt = new Date(contents.createdAt / 1).toISOString()
		    const modifiedAt = new Date(contents.modifiedAt / 1).toISOString()
				const user = await this.usersRepository.findOneBy({id})

		    if (user != null) {
		      console.log("User found id: " + id)
		      success = false
		    } else {
		    	let user = new User()
		    	user.id = id 
		    	user.email = email
		    	user.familyName = familyName
		    	user.givenName = givenName
		    	user.modifiedAt = modifiedAt
		    	user.createdAt = createdAt
		    	console.log({user})
		      success = success && await this.usersRepository.save(user) != null
		      console.log({success})
		    }

			} else {
				success = false
			}
		} else if (message.type == 'workspace') {
	  	if (message.action == 'create') {
	  		const contents = JSON.parse(message.contents)
	  		const workspace = new WorkspaceDTO(
	  			contents.id,
	  			contents.title,
	  			contents.user,
	  			contents.labels.map(label => label.id),
	  			contents.documents.map(doc => doc.id),
	  			new Date(contents.createdAt).toISOString(),
	  			new Date(contents.modifiedAt).toISOString()
	  		)
	  		
	  		success = success && await this.createWorkspace(workspace)
	  	} else {
	  		success = false
	  	}

	  } else if (message.type == 'label') {
	  	success = await this.processLabel(message)
	  } else if (message.type == 'labelLink') {
	  	success = await this.processLabelLink(message)
	  } else if (message.type == 'block') {
	  	success = await this.processBlock(message)
		} else {
			success = false
		}

		if (success) {
			messageEntity.isSynced = true
	 		success = await this.messagesRepository.save(messageEntity) != null			
		}

		return success
	}

	async processBlock(message: SyncMessage):Promise <boolean> {
		if (message.action == 'create') {
			const contents = JSON.parse(message.contents)
			const block = new BlockDTO(
				contents.id,
				contents.type,
				contents.document,
				contents.content,
				contents.prev,
				contents.next,
				new Date(contents.createdAt).toISOString(),
  			new Date(contents.modifiedAt).toISOString()
			)
  		
  		return await this.createBlock(block)
		} else if (message.action == 'update') {
			const keyValues = JSON.parse(message.contents)
			const id = keyValues["id"]
			console.log({id})
			const block = await this.blockRepository.findOneBy({id})
			if (block != null) {
				console.log("timestamp:", message.timestamp)
				console.log("modifiedAt:", block.modifiedAt)
				if (new Date(message.timestamp) > new Date(block.modifiedAt)) {
					block["content"] = keyValues["content"]
			    block.modifiedAt = new Date(message.timestamp / 1).toISOString()

			    console.log({block})
					return await this.blockRepository.save(block) != null	
				} else {
					return false
				}
			} else {
				return false
			}
		} else {
			return false
		}
	}

	async processLabel(message: SyncMessage): Promise<boolean> {
		if (message.action == 'create') {
			const contents = JSON.parse(message.contents)
			const label = new LabelDTO(
				contents.id,
				contents.title,
				contents.workspace,
				contents.color,
				new Date(contents.createdAt).toISOString(),
  			new Date(contents.modifiedAt).toISOString()
			)
  		
  		return await this.createLabel(label)
		} else {
			return false
		}
	}

	async createBlock(block: BlockDTO): Promise<boolean> {
		const blockEntity = new Block()
		blockEntity.id = block.id
		blockEntity.type = block.type
		blockEntity.document = block.document
		blockEntity.content = block.content
		blockEntity.prev = block.prev
		blockEntity.next = block.next
		blockEntity.createdAt = block.createdAt
		blockEntity.modifiedAt = block.modifiedAt
		return await this.blockRepository.save(blockEntity) != null
	}

	async createLabel(label: LabelDTO): Promise<boolean> {
		const labelEntity = new Label()
		labelEntity.id = label.id
		labelEntity.title = label.title
		labelEntity.workspace = label.workspace
		labelEntity.color = label.color
		labelEntity.createdAt = label.createdAt
		labelEntity.modifiedAt = label.modifiedAt
		return await this.labelRepository.save(labelEntity) != null
	}

	async processLabelLink(message: SyncMessage): Promise<boolean> {
		if (message.action == 'create') {
			const contents = JSON.parse(message.contents)
			const labelLink = new LabelLinkDTO(
				contents.id,
				contents.label,
				contents.workspace,
				contents.document,
				new Date(contents.createdAt).toISOString(),
  			new Date(contents.modifiedAt).toISOString()
			)
  		
  		return await this.createLabelLink(labelLink)
		} else {
			return false
		}
	}

	async createLabelLink(labelLink: LabelLinkDTO): Promise<boolean> {
		const labelEntity = new LabelLink()
		labelEntity.id = labelLink.id
		labelEntity.label = labelLink.label
		labelEntity.workspace = labelLink.workspace
		labelEntity.document = labelLink.document
		labelEntity.createdAt = labelLink.createdAt
		labelEntity.modifiedAt = labelLink.modifiedAt
		return await this.labelLinkRepository.save(labelEntity) != null
	}
}
