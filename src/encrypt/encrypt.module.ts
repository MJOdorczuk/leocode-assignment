
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EncryptService } from './encrypt.service';

@Module({
  imports: [UsersModule],
  providers: [EncryptService],
  exports: [EncryptService],
})
export class AuthModule {}
