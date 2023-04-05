import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World!';
  }

  createUser(id: String) {
    if (id == "123") {
      return true
    } else {
      return false
    }
  }
}
