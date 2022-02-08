import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { generateKeyPairSync, publicEncrypt } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { RSA_NO_PADDING, RSA_PKCS1_PADDING } from 'constants';

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
      this.usersService.updateUser(user.email, user);
      const privKey = readFileSync("private_key", "utf8");
      unlinkSync("public_key");
      unlinkSync("private_key");
      return {pubKey: user.pubKey, privKey: privKey};
    }
    return null;
  }

  async encryptFile(file: string, email: string){
    const content = Buffer.from(readFileSync(file, "base64"), "base64");
    const user = await this.usersService.findOne(email);
    if(user){
      var chunks = [], i = 0, n = content.length;
      while (i < n) {
        // 2048 bits and string is base64 therefore chunks should be 32
        chunks.push(content.slice(i, i += 32));
      }
      return chunks
        .map(chunk => publicEncrypt({key: user.pubKey, padding: RSA_PKCS1_PADDING}, chunk).toString("base64"))
        .join();
    }
    return null;
  }
}
