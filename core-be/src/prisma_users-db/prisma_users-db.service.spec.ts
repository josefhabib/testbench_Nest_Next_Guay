import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUsersDbService } from './prisma_users-db.service';

describe('PrismaUsersDbService', () => {
  let service: PrismaUsersDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaUsersDbService],
    }).compile();

    service = module.get<PrismaUsersDbService>(PrismaUsersDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
