import { Controller, Request, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EncryptService } from './encrypt/encrypt.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private encryptService: EncryptService) {}

  @UseGuards(LocalAuthGuard)
  @Post('api/sign-in')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/generate-key-pair')
  generateKeyPair(@Request() req) {
    return this.encryptService.generateKeyPair(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/encrypt')
  async encrypt(@Request() req) {
    const encrypted = await this.encryptService.encryptFile("sample.pdf", req.user.email);
    if(!encrypted){
      throw new HttpException('No encryption key generated yet', HttpStatus.FORBIDDEN);
    }
    return encrypted;
  }
}
