import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  public users: User[] = [
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
  ]

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async updateUser(email: string, update: User) {
    const index = this.users.findIndex(user => email === user.email);
    this.users[index] = update;
  }
}
