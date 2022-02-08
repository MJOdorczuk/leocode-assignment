import { Test, TestingModule } from '@nestjs/testing';
import { RSA_PKCS1_PADDING } from 'constants';
import { privateDecrypt, publicEncrypt } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { UsersService } from '../users/users.service';
import { EncryptService } from './encrypt.service';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

let usersService : UsersService;
let realUser: { email: string; pubKey?: string; password: string; aux: string; };
let fakeUser: { email: string; password: string; };
let message: string;
let file: string;
let fileContent: string;

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService, UsersService],
    }).compile();

    realUser = {
        email: Math.random().toString(36).slice(2) + '@mail.com',
        password: Math.random().toString(36).slice(2),
        aux: Math.random().toString(36).slice(2),
        pubKey: null,
    };
    fakeUser = {
        email: Math.random().toString(36).slice(2) + '@mail.com',
        password: Math.random().toString(36).slice(2)
    };
    message = Math.random().toString(36).slice(2);
    file = Math.random().toString(36).slice(2);
    fileContent = Math.random().toString(36).slice(2);
    writeFileSync(file, fileContent);

    service = module.get<EncryptService>(EncryptService);
    usersService = module.get<UsersService>(UsersService);
    const realUserCall = () => realUser;
    jest.spyOn(usersService, "findOne").mockImplementation(async (email: string) => {
      if(email === realUser.email){
        return realUserCall();
      }
      return null;
    });
    jest.spyOn(usersService, "updateUser").mockImplementation(async (email: string, update: any) => {
      if(email === realUser.email){
        realUser.pubKey = update.pubKey;
      }
    });
  });

  afterEach(async () => {
    unlinkSync(file);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate key pair', async () => {
    const result = await service.generateKeyPair(realUser.email);
    expect(usersService.findOne).toHaveBeenCalledWith(realUser.email);
    const encrypted = publicEncrypt(result.pubKey, Buffer.from(message));
    const decrypted = privateDecrypt({
      key: result.privKey,
      passphrase: '',
    }, encrypted);
    expect(decrypted).toEqual(Buffer.from(message));
    expect(realUser.pubKey).toEqual(result.pubKey);
  });

  it('should not generate key pair for fake user', async () => {
    const result = await service.generateKeyPair(fakeUser.email);
    expect(result).toBeFalsy();
  });

  it('should encrypt file', async () => {
      const keys = await service.generateKeyPair(realUser.email);
      const encrypted = await service.encryptFile(file, realUser.email);
      const content = readFileSync(file, "base64");
      const decrypted = privateDecrypt({
        key: keys.privKey,
        passphrase: '',
        padding: RSA_PKCS1_PADDING,
      }, Buffer.from(encrypted, "base64"));
      expect(decrypted.toString("base64")).toEqual(content);
  });

  it('should not encrypt file for fake user', async () => {
    const encrypted = await service.encryptFile(file, fakeUser.email);
    expect(encrypted).toBeFalsy();
  });

  it('should not encrypt file when key is missing', async () => {
    const encrypted = await service.encryptFile(file, realUser.email);
    expect(encrypted).toBeFalsy();
  });
});
