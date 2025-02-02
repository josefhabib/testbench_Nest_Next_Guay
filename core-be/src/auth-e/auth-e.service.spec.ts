import { Test, TestingModule } from '@nestjs/testing';
import { AuthEService } from './auth-e.service';

describe('AuthEService', () => {
  let service: AuthEService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthEService],
    }).compile();

    service = module.get<AuthEService>(AuthEService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
