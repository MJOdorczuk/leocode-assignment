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
    service = new UsersService();
    service.users = [realUser];
  });

  it('should find one', async () => {
    const result = await service.findOne(realUser.email);
    expect(result).toEqual(realUser);
  });

  it('should not find fake user', async () => {
    const result = await service.findOne(fakeUser.email);
    expect(result).toBeFalsy();
  });

  it('should update user', async () => {
    await service.updateUser(realUser.email, fakeUser);
    expect(service.users.length).toEqual(1);
    expect(service.users[0]).toEqual(fakeUser);
  });

  it('should not update fake user', async () => {
    await service.updateUser(fakeUser.email, fakeUser);
    expect(service.users.length).toEqual(1);
    expect(service.users[0]).toEqual(realUser);
  })
});
