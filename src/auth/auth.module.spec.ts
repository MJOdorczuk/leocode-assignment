import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthModule } from './auth.module';

describe('AuthModel', () => {
  let service: AuthModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppModule],
    }).compile();

    service = module.get<AppModule>(AppModule);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
