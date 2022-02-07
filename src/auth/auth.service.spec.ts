import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { buffer } from 'stream/consumers';
import { UsersService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

const realUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2),
  aux: Math.random().toString(36).slice(2),
};
const fakeUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2)
};

const keys = {
  pubKey: Math.random().toString(36).slice(2),
  privKey: Math.random().toString(36).slice(2)
};

let usersService : UsersService;

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest.spyOn(usersService, "findOne").mockImplementation(async (email: string) => {
      if(email === realUser.email){
        return realUser;
      }
      return null;
    });
    jest.spyOn(usersService, "generateKeyPair").mockImplementation(async (email : string) => {
      if(email === realUser.email){
        return keys;
      }
      return null;
    });
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
  });

  it('should not validate real user with wrong password', async () =>{
    const result = await service.validateUser(realUser.email, fakeUser.password);
    expect(result).toBeFalsy();
  });

  it('should generate key pair', async () => {
    const result = await service.generateKeyPair(realUser);
    expect(usersService.generateKeyPair).toBeCalledWith(realUser.email);
    expect(result).toEqual(keys);
  });

  it('should not generate key pair for fake user', async () => {
    const result = await service.generateKeyPair(fakeUser);
    expect(result).toBeFalsy();
  });
});
