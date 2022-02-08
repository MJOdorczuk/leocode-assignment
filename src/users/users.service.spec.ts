import { UsersService } from './users.service';

let realUser: { email: any; password: string; aux: string; };
let fakeUser: { email: any; password: string; };

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    realUser = {
      email: Math.random().toString(36).slice(2) + '@mail.com',
      password: Math.random().toString(36).slice(2),
      aux: Math.random().toString(36).slice(2),
    };
    fakeUser = {
      email: Math.random().toString(36).slice(2) + '@mail.com',
      password: Math.random().toString(36).slice(2)
    };
    service = new UsersService([realUser]);
  });

  it('should find one', async () => {
    const result = await service.findOne(realUser.email);
    expect(result).toEqual(realUser);
  });

  it('should not find fake user', async () => {
    const result = await service.findOne(fakeUser.email);
    expect(result).toBeFalsy();
  });
});
