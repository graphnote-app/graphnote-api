import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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
    createdAt: string, 
    modifiedAt: string
  ): Promise<User> {

    const user = new User()
    user.id = id
    user.givenName = givenName
    user.familyName = familyName
    user.email = email
    user.modifiedAt = modifiedAt 
    user.createdAt = createdAt
    return await this.usersRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}