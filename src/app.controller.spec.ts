import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { EncryptService } from './encrypt/encrypt.service';

let realUser: { email: any; password: string; };
let keys: { pubKey: any; privKey: string; };
let fileContent: string;

let authService: AuthService;
let encryptService: EncryptService;

jest.mock('./auth/auth.service');
jest.mock('./encrypt/encrypt.service');

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AuthService, EncryptService],
    }).compile();
    realUser = {
      email: Math.random().toString(36).slice(2) + '@mail.com',
      password: Math.random().toString(36).slice(2)
    };
    keys = {
      privKey: Math.random().toString(36).slice(2),
      pubKey: Math.random().toString(36).slice(2)
    };
    fileContent = Math.random().toString(36).slice(2);
    authService = app.get<AuthService>(AuthService);
    encryptService = app.get<EncryptService>(EncryptService);

    jest.spyOn(authService, 'login').mockImplementation(async () => null);
    jest.spyOn(encryptService, 'generateKeyPair').mockImplementation(async () => null);
    jest.spyOn(encryptService, 'encryptFile').mockImplementation(async () => null);

    appController = app.get<AppController>(AppController);
  });

  it(`should sign in`, async () => {
    await appController.signIn({user: realUser});
    expect(authService.login).toHaveBeenCalledWith(realUser);
  });

  it('should generate key pair', async () => {
    await appController.generateKeyPair({user: realUser});
    expect(encryptService.generateKeyPair).toHaveBeenLastCalledWith(realUser.email);
  });

  it('should encrypt file', async () => {
    await appController.encrypt({user: realUser});
    expect(encryptService.encryptFile).toBeCalledWith('../sample.pdf', realUser.email);
  });
});
