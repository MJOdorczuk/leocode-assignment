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
}

let authService: AuthService;

jest.mock('./auth/auth.service');
AuthService.prototype.login = async (user: any) => {
  return user.email;
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AuthService],
    }).compile();
    authService = app.get<AuthService>(AuthService);

    appController = app.get<AppController>(AppController);
  });

  it(`should sign-in`, async () => {

    const email = await appController.sign_in({user: realUser});
    expect(authService.login).toHaveBeenCalledWith(realUser);
    expect(email).toEqual(realUser.email);
  });
});
