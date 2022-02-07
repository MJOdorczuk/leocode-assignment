import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { publicEncrypt, privateDecrypt } from 'crypto';

const realUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2),
  aux: Math.random().toString(36).slice(2),
};
const fakeUser = {
  email: Math.random().toString(36).slice(2) + '@mail.com',
  password: Math.random().toString(36).slice(2)
};
const message = Math.random().toString(36).slice(2);

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
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

  it('should generate key pair', async () => {
    const result = await service.generateKeyPair(realUser.email);
    console.log(result.pubKey.toString());
    const encrypted = publicEncrypt(result.pubKey, Buffer.from(message));
    const decrypted = privateDecrypt({
      key: result.privKey,
      passphrase: '',
    }, encrypted);
    expect(decrypted).toEqual(Buffer.from(message));
  });

  it('should not generate key pair for fake user', async () => {
    const result = await service.generateKeyPair(fakeUser.email);
    expect(result).toBeFalsy();
  });
});
