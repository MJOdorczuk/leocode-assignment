import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
jest.mock('@nestjs/jwt');
jest.mock('./auth.service');

let realUser: { email: any; password: any; aux: any; };
let fakeUser: { email: any; password: any; };

let authService: AuthService;

describe('LocalStrategy', () => {
  let service: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy, AuthService, {provide: UsersService, useValue: new UsersService()}, JwtService],
    }).compile();

    realUser = {
      email: Math.random().toString(36).slice(2) + '@mail.com',
      password: Math.random().toString(36).slice(2),
      aux: Math.random().toString(36).slice(2),
    };
    fakeUser = {
      email: Math.random().toString(36).slice(2) + '@mail.com',
      password: Math.random().toString(36).slice(2)
    };
    service = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    jest.spyOn(authService, "validateUser").mockImplementation(async (email: string, pass: string) => {
      if(email === realUser.email && pass === realUser.password){
        return {email: realUser.email, aux: realUser.aux};
      }
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate', async () => {
    const result = await service.validate(realUser.email, realUser.password);
    expect(authService.validateUser).toHaveBeenCalledWith(realUser.email, realUser.password);
    expect(result).toEqual({email: realUser.email, aux: realUser.aux});
  });

  it('should throw exception on validating fake user',  async () => {
    try {
      await service.validate(fakeUser.email, fakeUser.password)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      return;
    }
    fail('should throw exception on validating fake user');
  });

  it('should throw exception on validating real user with wrong password', async () => {
    try {
      await service.validate(realUser.email, fakeUser.password)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      return;
    }
    fail('should throw exception on validating real user with wrong password');
  });
});
