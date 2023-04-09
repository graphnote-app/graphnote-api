import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserDTO {
  constructor(
    id: string,
    email: string,
    givenName: string | null,
    familyName: string | null,
    createdAt: number,
    modifiedAt: number
  ) {
    this.id = id
    this.email = email
    this.givenName = givenName
    this.familyName = familyName
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }

  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  createdAt: number;
  modifiedAt: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    id: string,
    email: string, 
    familyName: string | null, 
    givenName: string | null, 
    createdAt: Date, 
    modifiedAt: Date
  ): Promise<UserDTO | null> {

    const user = new User()
    user.id = id
    user.givenName = givenName
    user.familyName = familyName
    user.email = email
    user.modifiedAt = modifiedAt.toISOString()
    user.createdAt = createdAt.toISOString()
    if (await this.usersRepository.save(user) != null) {
      return new UserDTO(user.id, user.email, user.givenName, user.familyName, new Date(user.createdAt).getTime(), new Date(user.modifiedAt).getTime())
    } else {
      return null
    }
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      if (user != null) {
        return new UserDTO(user.id, user.email, user.givenName, user.familyName, new Date(user.createdAt).getTime(), new Date(user.modifiedAt).getTime())
      } else {
        return null
      }  
    }).filter(user => user != null)
  }

  async findOne(id: string): Promise<UserDTO | null> {
    const user = await this.usersRepository.findOneBy({ id })
    if (user != null) {
      return new UserDTO(user.id, user.email, user.givenName, user.familyName, new Date(user.createdAt).getTime(), new Date(user.modifiedAt).getTime())
    } else {
      return null
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}