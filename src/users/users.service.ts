import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private users: User[] = [
    {
      userId: 1,
      email: 'john@jhn.jn',
      password: 'changeme',
      pubKey: null,
    },
    {
      userId: 2,
      email: 'example@mail.com',
      password: 'guess',
      pubKey: null,
    },
  ]){};

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async generateKeyPair(email: string) {
    const user = await this.findOne(email);
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
}
