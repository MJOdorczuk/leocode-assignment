import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private users: User[] = [
    {
      userId: 1,
      email: 'john@jhn.jn',
      password: 'changeme',
      pubKey: null,
    },
    {
      userId: 2,
      email: 'example@mail.com',
      password: 'guess',
      pubKey: null,
    },
  ]){};

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}
