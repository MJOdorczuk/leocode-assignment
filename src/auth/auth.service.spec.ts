import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

const realUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2),
  aux: Math.random().toString(36).slice(2),
}
const fakeUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2)
}

UsersService.prototype.findOne = async (email: string) => {
  if(email === realUser.email){
    return realUser;
  }
  return null;
}

let usersService : UsersService;

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    const result = await service.validateUser(realUser.email, realUser.password);
    expect(usersService.findOne).toHaveBeenCalledWith(realUser.email);
    expect(result).toEqual({email: realUser.email, aux: realUser.aux});
  });

  it('should not validate fake user', async () => {
    const result = await service.validateUser(fakeUser.email, fakeUser.password);
    expect(result).toBeFalsy();
  })

  it('should not validate real user with wrong password', async () =>{
    const result = await service.validateUser(realUser.email, fakeUser.password);
    expect(result).toBeFalsy();
  })
});
