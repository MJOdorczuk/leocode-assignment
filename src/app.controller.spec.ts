import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
var crypto = require("crypto");


const realUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2)
};

const keys = {
  privKey: Math.random().toString(36).slice(2),
  pubKey: Math.random().toString(36).slice(2)
};

let authService: AuthService;

jest.mock('./auth/auth.service');

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AuthService],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    jest.spyOn(authService, 'login').mockImplementation(async (user: any) => user.email);
    jest.spyOn(authService, 'generateKeyPair').mockImplementation(async (user: any) => keys);

    appController = app.get<AppController>(AppController);
  });

  it(`should sign in`, async () => {
    const email = await appController.signIn({user: realUser});
    expect(authService.login).toHaveBeenCalledWith(realUser);
    expect(email).toEqual(realUser.email);
  });

  it('should generate key pair', async () => {
    const result = await appController.generateKeyPair({user: realUser});
    expect(authService.generateKeyPair).toHaveBeenLastCalledWith(realUser);
    expect(result).toEqual(keys);
  });
});
