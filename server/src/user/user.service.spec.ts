import { Test, TestingModule } from '@nestjs/testing';
import { User } from './domain/user';
import { UserRepository } from './persistence/user.repository';
import { MockUserRepository } from './persistence/user.repository.spec';
import { UserService } from './user.service';

export class MockUserService {
  async getUserByUsername(username: string): Promise<User> {
    return User.builder().set('id', 1).set('username', username).build();
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useClass: MockUserRepository },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByUsername', () => {
    it('success', async () => {
      // given
      const username = 'username';

      // when
      const result = await service.getUserByUsername(username);

      // then
      expect(result.id).toEqual(expect.any(Number));
      expect(result.username).toBe(username);
    });
  });
});
