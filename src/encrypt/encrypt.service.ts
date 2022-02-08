import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { generateKeyPairSync, publicEncrypt } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class EncryptService {
  constructor(
    private usersService: UsersService
  ) {}

  async generateKeyPair(email: string){
    const user = await this.usersService.findOne(email);
    if (user){
      const keyPair = generateKeyPairSync('rsa', {
        modulusLength: 520,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: ''
        }
      });
      writeFileSync("public_key", keyPair.publicKey);
      writeFileSync("private_key", keyPair.privateKey);
      user.pubKey = readFileSync("public_key", "utf8");
      const privKey = readFileSync("private_key", "utf8");
      unlinkSync("public_key");
      unlinkSync("private_key");
      return {pubKey: user.pubKey, privKey: privKey};
    }
    return null;
  }

  async encryptFile(file: string, email: string){
    const content = readFileSync(file, "base64");
    return this.usersService
        .findOne(email)
        .then(user => publicEncrypt(user.pubKey, Buffer.from(content, "base64")), () => null)
        .then(encrypted => encrypted.toString("base64"), () => null);
  }
}
