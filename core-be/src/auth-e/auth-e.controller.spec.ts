import { Test, TestingModule } from '@nestjs/testing';
import { AuthEController } from './auth-e.controller';

describe('AuthEController', () => {
  let controller: AuthEController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthEController],
    }).compile();

    controller = module.get<AuthEController>(AuthEController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
