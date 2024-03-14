import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

export class MockHashingService {
  async hashPassword(password: string): Promise<string> {
    return new Date().getTime + password;
  }
}

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('success', async () => {
      // given
      const password = 'password';

      // when
      const result1 = await service.hashPassword(password);
      const result2 = await service.hashPassword(password);

      // then
      expect(result1).toEqual(expect.any(String));
      expect(result1).not.toBe(password);
      expect(result1).not.toBe(result2);
    });
  });
});
